using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.Common.Mapping;
using BattleArena.Infrastructure.Repositories.Queries;
using BattleArena.Infrastructure.Repositories.Commands;
using Microsoft.Extensions.DependencyInjection;

namespace BattleArena.Infrastructure;

/// <summary>
/// Registers Infrastructure services (repositories). DbContext is registered by the host (e.g. Aspire AddNpgsqlDbContext).
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserQueryRepository, UserQueryRepository>();
        services.AddScoped<IUserCommandRepository, UserCommandRepository>();
        services.AddScoped<IArenaCommandRepository, ArenaCommandRepository>();
        services.AddScoped<IArenaQueryRepository, ArenaQueryRepository>();
        services.AddScoped<IGameCommandRepository, GameCommandRepository>();
        services.AddScoped<ITriviaGameCommandRepository, TriviaGameCommandRepository>();
        services.AddScoped<ITriviaGameQueryRepository, TriviaGameQueryRepository>();
        services.AddScoped<IQuestionTopicQueryRepository, QuestionTopicQueryRepository>();
        services.AddScoped<IQuestionQueryRepository, QuestionQueryRepository>();

        services.AddAutoMapper(cfg => cfg.AddProfile<DbToDtoMapper>());

        return services;
    }
}
