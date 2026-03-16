namespace BattleArena.Domain.Models;

public sealed record Player(int Id, string UserName, int Wins, int Losses, int Wager, int PowerIndex);

