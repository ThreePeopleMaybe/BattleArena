using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;
using static BattleArena.Application.Common.Dto;
namespace BattleArena.Application.Users.Queries;

public sealed record MatchActivePlayersQuery(int GameTypeId, long UserId) : IRequest<PlayerDto?>;

public sealed class MatchActivePlayersQueryHandler(IUserQueryRepository userRepository, IUserCommandRepository userCommandRepository, IMapper mapper)
    : IRequestHandler<MatchActivePlayersQuery, PlayerDto?>
{
    public async Task<PlayerDto?> Handle(MatchActivePlayersQuery request, CancellationToken cancellationToken)
    {
        var timeoutAt = DateTime.UtcNow.AddMinutes(1);

        while (DateTime.UtcNow < timeoutAt)
        {
            var existingMatchedPlayer = await userRepository.GetMatchedPlayerAsync(request.UserId, request.GameTypeId, cancellationToken);
            if (existingMatchedPlayer is not null)
            {
                return mapper.Map<PlayerDto?>(existingMatchedPlayer);
            }

            var activePlayers = await userRepository.GetActivePlayersByGameTypeIdAsync(request.GameTypeId, cancellationToken);
            var currentPlayer = activePlayers.FirstOrDefault(p => p.Id == request.UserId);

            if (currentPlayer is not null)
            {
                var matchedPlayer = activePlayers
                    .Where(p => p.Id != request.UserId)
                    .OrderBy(p => Math.Abs(p.Wager - currentPlayer.Wager))
                    .ThenBy(p => Math.Abs(p.PowerIndex - currentPlayer.PowerIndex))
                    .FirstOrDefault();

                if (matchedPlayer is not null)
                {
                    var reserved = await userCommandRepository.TrySetPlayersPlayingAsync(request.UserId, matchedPlayer.Id, request.GameTypeId, cancellationToken);

                    if (reserved)
                    {
                        return mapper.Map<PlayerDto?>(matchedPlayer);
                    }
                }
            }

            var remaining = timeoutAt - DateTime.UtcNow;
            if (remaining <= TimeSpan.Zero)
            {
                break;
            }

            await Task.Delay(remaining < TimeSpan.FromSeconds(5) ? remaining : TimeSpan.FromSeconds(5), cancellationToken);
        }

        return null;
    }
}
