using System.Text.Json;
using BattleArena.Db;
using BattleArena.Shared;
using Microsoft.EntityFrameworkCore;

var connectionString = ResolveConnectionString(args);
if (string.IsNullOrWhiteSpace(connectionString))
{
    Console.Error.WriteLine("Missing PostgreSQL connection string.");
    return;
}

var options = new DbContextOptionsBuilder<BattleArenaDbContext>()
    .UseNpgsql(connectionString)
    .Options;

await using var db = new BattleArenaDbContext(options);

var loader = new TriviaDataLoader(db);
await loader.LoadAsync();

static string? ResolveConnectionString(string[] args)
{
    var fromAppSettings = ReadConnectionStringFromAppSettings();
    if (!string.IsNullOrWhiteSpace(fromAppSettings))
    {
        return fromAppSettings;
    }

    return string.Empty;
}

static string? ReadConnectionStringFromAppSettings()
{
    var appSettingsPath = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
    if (!File.Exists(appSettingsPath))
    {
        appSettingsPath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
        if (!File.Exists(appSettingsPath))
        {
            return null;
        }
    }

    var json = File.ReadAllText(appSettingsPath);
    var config = JsonSerializer.Deserialize<TriviaDataLoaderSettings>(
        json,
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

    if (config?.ConnectionStrings is null)
    {
        return null;
    }

    if (config.ConnectionStrings.TryGetValue("battlearena", out var byName)
        && !string.IsNullOrWhiteSpace(byName))
    {
        return byName;
    }

    return null;
}

file sealed class TriviaDataLoader(BattleArenaDbContext db)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true, };

    public async Task LoadAsync(CancellationToken cancellationToken = default)
    {
        var categoriesByName = await LoadCategoriesAsync(cancellationToken);
        var topicsByCategoryAndName = await LoadTopicsAsync(categoriesByName, cancellationToken);
        await LoadQuestionsAsync(categoriesByName, topicsByCategoryAndName, cancellationToken);
    }

    private async Task<Dictionary<string, QuestionTopicCategory>> LoadCategoriesAsync(
        CancellationToken cancellationToken)
    {
        var categoriesPath = Path.Combine(AppContext.BaseDirectory, "Data", "question_topic_categories.json");
        var rows = await ReadJsonOrThrowAsync<List<QuestionTopicCategorySeedRow>>(categoriesPath, cancellationToken) ??
                   [];

        var existing = await db.QuestionTopicCategories
            .ToListAsync(cancellationToken);
        var categoryByName = existing.ToDictionary(c => c.Name, StringComparer.OrdinalIgnoreCase);

        var toAdd = new List<QuestionTopicCategory>();
        foreach (var row in rows)
        {
            if (string.IsNullOrWhiteSpace(row.Name))
            {
                continue;
            }

            var normalizedName = row.Name.Trim();
            if (categoryByName.ContainsKey(normalizedName))
            {
                continue;
            }

            var category = new QuestionTopicCategory
            {
                Name = normalizedName,
                Description = string.IsNullOrWhiteSpace(row.Description) ? null : row.Description.Trim(),
            };

            categoryByName[normalizedName] = category;
            toAdd.Add(category);
        }

        if (toAdd.Count > 0)
        {
            await db.QuestionTopicCategories.AddRangeAsync(toAdd, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
        }

        return await db.QuestionTopicCategories
            .ToDictionaryAsync(c => c.Name, StringComparer.OrdinalIgnoreCase, cancellationToken);
    }

    private async Task<Dictionary<(int CategoryId, string TopicName), QuestionTopic>> LoadTopicsAsync(
        Dictionary<string, QuestionTopicCategory> categoriesByName,
        CancellationToken cancellationToken)
    {
        var topicsPath = Path.Combine(AppContext.BaseDirectory, "Data", "question_topics.json");
        var rows = await ReadJsonOrThrowAsync<Dictionary<string, List<QuestionTopicSeedRow>>>(topicsPath,
                       cancellationToken)
                   ?? new Dictionary<string, List<QuestionTopicSeedRow>>(StringComparer.OrdinalIgnoreCase);

        var existingTopics = await db.QuestionTopics
            .ToListAsync(cancellationToken);

        var existingTopicKeys = existingTopics
            .Select(t => (t.QuestionTopicCategoryId, t.Name))
            .ToHashSet();

        var toAdd = new List<QuestionTopic>();
        foreach (var (categoryName, topicRows) in rows)
        {
            if (!categoriesByName.TryGetValue(categoryName, out var category))
            {
                Console.WriteLine($"Skipping topics for unknown category: {categoryName}");
                continue;
            }

            foreach (var row in topicRows)
            {
                if (string.IsNullOrWhiteSpace(row.Name))
                {
                    continue;
                }

                var topicName = row.Name.Trim();
                var key = (category.Id, topicName);
                if (existingTopicKeys.Contains(key))
                {
                    continue;
                }

                var topic = new QuestionTopic
                {
                    Name = topicName,
                    Description = string.IsNullOrWhiteSpace(row.Description) ? null : row.Description.Trim(),
                    QuestionTopicCategoryId = category.Id,
                    Category = category,
                };

                toAdd.Add(topic);
                existingTopicKeys.Add(key);
            }
        }

        if (toAdd.Count > 0)
        {
            await db.QuestionTopics.AddRangeAsync(toAdd, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
        }

        return await db.QuestionTopics
            .ToDictionaryAsync(t => (t.QuestionTopicCategoryId, t.Name), cancellationToken);
    }

    private async Task LoadQuestionsAsync(
        Dictionary<string, QuestionTopicCategory> categoriesByName,
        Dictionary<(int CategoryId, string TopicName), QuestionTopic> topicsByCategoryAndName,
        CancellationToken cancellationToken)
    {
        var questionsPath = Path.Combine(AppContext.BaseDirectory, "Data", "questions.json");
        var rows = await ReadJsonOrThrowAsync<List<QuestionSeedRow>>(questionsPath, cancellationToken) ?? [];

        var topicsByCategory = topicsByCategoryAndName
            .Values
            .GroupBy(t => t.QuestionTopicCategoryId)
            .ToDictionary(g => g.Key, g => g.OrderBy(t => t.Name).ToList());

        var roundRobin = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

        var existingQuestionKeys = await db.Questions
            .Select(q => new { q.QuestionTopicId, q.Text })
            .ToListAsync(cancellationToken);

        var existingQuestionSet = existingQuestionKeys
            .Select(q => $"{q.QuestionTopicId}|{q.Text}".ToLowerInvariant())
            .ToHashSet();

        var toAdd = new List<Question>();
        foreach (var row in rows)
        {
            if (!categoriesByName.TryGetValue(row.CategoryName, out var category))
            {
                Console.WriteLine($"Skipping question with unknown category: {row.CategoryName}");
                continue;
            }

            if (!topicsByCategory.TryGetValue(category.Id, out var topicOptions) || topicOptions.Count == 0)
            {
                Console.WriteLine($"Skipping question because category has no topics: {row.CategoryName}");
                continue;
            }

            if (row.Options is not { Length: 4 } || row.CorrectIndex is < 0 or > 3)
            {
                continue;
            }

            QuestionTopic? topic;
            var requestedTopicName = row.TopicName?.Trim();
            if (!string.IsNullOrWhiteSpace(requestedTopicName))
            {
                topicsByCategoryAndName.TryGetValue((category.Id, requestedTopicName), out topic);
            }
            else
            {
                var idx = roundRobin.GetValueOrDefault(row.CategoryName, 0);
                topic = topicOptions[idx % topicOptions.Count];
                roundRobin[row.CategoryName] = idx + 1;
            }

            if (topic == null)
            {
                continue;
            }

            var questionKey = $"{topic.Id}|{row.Text}".ToLowerInvariant();
            if (existingQuestionSet.Contains(questionKey))
            {
                continue;
            }

            var question = new Question
            {
                Type = QuestionType.Text,
                AnswerType = QuestionAnswerType.MultipleChoice,
                QuestionTopicId = topic.Id,
                Topic = topic,
                Text = row.Text,
                ImageUrl = string.Empty,
                AudioUrl = string.Empty,
                VideoUrl = string.Empty,
                Points = 1,
                Choices = [],
            };

            for (var i = 0; i < row.Options.Length; i++)
            {
                question.Choices!.Add(new QuestionChoice
                {
                    Question = question, Position = i, Text = row.Options[i], IsCorrectChoice = i == row.CorrectIndex,
                });
            }

            existingQuestionSet.Add(questionKey);
            toAdd.Add(question);
        }

        if (toAdd.Count > 0)
        {
            await db.Questions.AddRangeAsync(toAdd, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
        }

        Console.WriteLine($"Load complete. Inserted {toAdd.Count} questions.");
    }

    private static async Task<T?> ReadJsonOrThrowAsync<T>(string path, CancellationToken cancellationToken)
    {
        if (!File.Exists(path))
        {
            throw new FileNotFoundException($"Required seed file was not found: {path}", path);
        }

        await using var stream = File.OpenRead(path);
        return await JsonSerializer.DeserializeAsync<T>(stream, JsonOptions, cancellationToken);
    }
}

file sealed class QuestionTopicCategorySeedRow
{
    public string Name { get; set; } = "";
    public string? Description { get; set; }
}

file sealed class QuestionTopicSeedRow
{
    public string Name { get; set; } = "";
    public string? Description { get; set; }
}

file sealed record QuestionSeedRow(
        string CategoryName,
        string Text,
        string[] Options,
        int CorrectIndex,
        string? TopicName = null);

file sealed class TriviaDataLoaderSettings
{
    public Dictionary<string, string>? ConnectionStrings { get; set; }
}
