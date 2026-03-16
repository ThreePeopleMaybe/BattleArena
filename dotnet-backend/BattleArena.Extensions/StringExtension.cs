namespace BattleArena.Extensions;

public static class StringExtension
{
    public static bool EqualsIgnoreCase(this string? source, string? value)
    {
        return string.Equals(source, value, StringComparison.OrdinalIgnoreCase);
    }
}
