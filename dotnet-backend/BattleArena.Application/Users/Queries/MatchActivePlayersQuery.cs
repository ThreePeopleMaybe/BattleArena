using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Users.Queries;

public sealed record MatchActivePlayersQuery(int GameTypeId, long UserId) : IRequest<PlayerDto?>;

public sealed class MatchActivePlayersQueryHandler(IUserQueryRepository userRepository, IMapper mapper)
    : IRequestHandler<MatchActivePlayersQuery, PlayerDto?>
{
    public async Task<PlayerDto?> Handle(MatchActivePlayersQuery request, CancellationToken cancellationToken)
    {
        var activePlayers = await userRepository.GetActivePlayersByGameTypeIdAsync(request.GameTypeId, cancellationToken);
        var currentPlayer = activePlayers.FirstOrDefault(p => p.Id == request.UserId);

        if (currentPlayer is null)
        {
            return null;
        }

        var matchedPlayer = activePlayers
            .Where(p => p.Id != request.UserId)
            .OrderBy(p => Math.Abs(p.Wager - currentPlayer.Wager))
            .ThenBy(p => Math.Abs(p.PowerIndex - currentPlayer.PowerIndex))
            .FirstOrDefault();

        return matchedPlayer is null ? null : mapper.Map<PlayerDto?>(matchedPlayer);
    }
}
