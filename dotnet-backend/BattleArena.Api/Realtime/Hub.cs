namespace BattleArena.Api.Realtime;

public sealed class Hub : Microsoft.AspNetCore.SignalR.Hub
{
    public const string HubPath = "/hubs/battlearena";

    public static string GroupName(int arenaId) => $"arena-{arenaId}";

    public Task Join(int arenaId) =>
        Groups.AddToGroupAsync(Context.ConnectionId, GroupName(arenaId));

    public Task Leave(int arenaId) =>
        Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupName(arenaId));
}
