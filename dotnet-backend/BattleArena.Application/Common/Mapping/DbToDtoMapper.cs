using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.TriviaGames.Queries;
using BattleArena.Db;
using BattleArena.Domain.Models;

namespace BattleArena.Application.Common.Mapping;

public sealed class DbToDtoMapper : Profile
{
    public DbToDtoMapper()
    {
        CreateMap<User, UserDto>();
        CreateMap<User, PlayerDto>();
        CreateMap<Player, PlayerDto>();
        CreateMap<QuestionTopicCategory, QuestionTopicCategoryDto>();
        CreateMap<Question, QuestionDto>();
        CreateMap<QuestionChoice, QuestionChoiceDto>();
        CreateMap<ActiveTriviaGameData, ActiveTriviaGameDto>();
    }
}
