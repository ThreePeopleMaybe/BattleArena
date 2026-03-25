using AutoMapper;
using BattleArena.Application.TriviaGames.Queries;
using BattleArena.Db;
using BattleArena.Domain.Models;
using static BattleArena.Application.Common.Dto;
namespace BattleArena.Application.Common.Mapping;

public sealed class DbToDtoMapper : Profile
{
    public DbToDtoMapper()
    {
        CreateMap<User, UserDto>();
        CreateMap<User, PlayerDto>();
        CreateMap<Player, PlayerDto>();
        CreateMap<QuestionTopicCategory, QuestionTopicCategoryDto>();
        CreateMap<QuestionTopic, QuestionTopicDto>();

        CreateMap<Question, QuestionDto>()
            .ForMember(d => d.CorrectChoiceId, opt => opt.MapFrom(s =>
                s.Choices == null || s.Choices.Count == 0
                    ? 0
                    : s.Choices.First(c => c.IsCorrectChoice).Id));

        CreateMap<QuestionChoice, QuestionChoiceDto>();
        CreateMap<ActiveTriviaGameData, ActiveTriviaGameDto>();
    }
}
