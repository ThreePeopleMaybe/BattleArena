namespace BattleArena.Api.Realtime;

public sealed record ArenaMemberChangedPayload(int ArenaId, long UserId, string UserName, string Action);

public sealed record GameRealtimePayload(
    int ArenaId,
    long GameId,
    long UserId,
    string UserName,
    string TopicName,
    int WagerAmount,
    string Status);
