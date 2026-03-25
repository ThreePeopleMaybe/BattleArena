using BattleArena.Application.Common.Interfaces;
using static BattleArena.Application.Common.Dto;
using MediatR;

namespace BattleArena.Application.Arenas.Commands;

public sealed record CreateArenaCommand(string ArenaName, int ArenaOwner) : IRequest<ArenaDto>;

public sealed class CreateArenaCommandHandler(IArenaCommandRepository arenaCommandRepository)
    : IRequestHandler<CreateArenaCommand, ArenaDto>
{
    public async Task<ArenaDto> Handle(CreateArenaCommand request, CancellationToken cancellationToken)
    {
        var arenaCode = await GenerateUniqueArenaCodeAsync(cancellationToken);

        var arena = await arenaCommandRepository.CreateArenaAsync(
            request.ArenaName,
            arenaCode,
            request.ArenaOwner,
            cancellationToken);

        return new ArenaDto(arena.Id, arena.ArenaName, arena.ArenaCode, arena.ArenaOwner, arena.Status);
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
