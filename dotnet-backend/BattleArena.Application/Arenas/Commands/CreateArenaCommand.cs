using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using MediatR;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Arenas.Commands;

public sealed record CreateArenaCommand(string ArenaName, long ArenaOwner, int Wager, int GameTypeId) : IRequest<ArenaDto>;

public sealed class CreateArenaCommandHandler(IArenaCommandRepository arenaCommandRepository, IMapper mapper, BattleArenaDbContext dbContext)
    : IRequestHandler<CreateArenaCommand, ArenaDto>
{
    public async Task<ArenaDto> Handle(CreateArenaCommand request, CancellationToken cancellationToken)
    {
        var arenaCode = await GenerateUniqueArenaCodeAsync(cancellationToken);
        var strategy = dbContext.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(
            state: request,
            operation: async (_, _, ct) =>
            {
                var arena = await arenaCommandRepository.CreateArenaAsync(
                    request.ArenaName,
                    arenaCode,
                    request.ArenaOwner,
                    request.Wager,
                    request.GameTypeId,
                    cancellationToken);

                await arenaCommandRepository.InsertArenaPlayerAsync(arena.Id, request.ArenaOwner, cancellationToken);

                return mapper.Map<ArenaDto>(arena);
            },
            verifySucceeded: null,
            cancellationToken: cancellationToken);
    }

    private async Task<string> GenerateUniqueArenaCodeAsync(CancellationToken cancellationToken)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        while (true)
        {
            Span<char> codeChars = stackalloc char[6];
            for (var i = 0; i < codeChars.Length; i++)
            {
                codeChars[i] = chars[Random.Shared.Next(chars.Length)];
            }

            var code = new string(codeChars);
            var exists = await arenaCommandRepository.ArenaCodeExistsAsync(code, cancellationToken);

            if (!exists)
            {
                return code;
            }
        }
    }
}
