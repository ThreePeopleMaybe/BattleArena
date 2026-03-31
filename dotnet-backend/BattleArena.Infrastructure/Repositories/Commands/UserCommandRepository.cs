using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Commands;

public class UserCommandRepository(BattleArenaDbContext dbContext) : IUserCommandRepository
{
    public async Task<User?> SignUpUserAsync(string username, string firstName, string lastName, string? email, string? phoneNumber, int? amount, CancellationToken cancellationToken = default)
    {
        var usernameExists = await dbContext.Users
            .AnyAsync(u => u.UserName == username, cancellationToken);

        if (usernameExists)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            var emailExists = await dbContext.Users
                .AnyAsync(u => u.Email == email, cancellationToken);

            if (emailExists)
            {
                return null;
            }
        }

        var now = DateTimeOffset.UtcNow;
        var user = new User
        {
            UserName = username,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PhoneNumber = phoneNumber,
            Amount = amount,
            CreatedBy = "system",
            CreatedAt = now,
            UpdatedBy = "system",
            UpdatedAt = now
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        return user;
    }

    public async Task UpsertActivePlayerAsync(long userId, int gameTypeId, bool isActive, bool isPlaying, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        await dbContext.Database.ExecuteSqlInterpolatedAsync($"""
            INSERT INTO active_players
                (user_id, game_type_id, is_active, is_playing, matched_user_id, created_by, created_at, updated_by, updated_at)
            VALUES
                ({userId}, {gameTypeId}, {isActive}, {isPlaying}, NULL, {"system"}, {now}, {"system"}, {now})
            ON CONFLICT (user_id, game_type_id)
            DO UPDATE SET
                is_active = EXCLUDED.is_active,
                is_playing = EXCLUDED.is_playing,
                matched_user_id = CASE
                    WHEN EXCLUDED.is_playing = FALSE THEN NULL
                    ELSE active_players.matched_user_id
                END,
                updated_by = EXCLUDED.updated_by,
                updated_at = EXCLUDED.updated_at;
            """, cancellationToken);
    }

    public async Task<bool> TrySetPlayersPlayingAsync(long userId, long matchedUserId, int gameTypeId, CancellationToken cancellationToken = default)
    {
        if (userId == matchedUserId)
        {
            return false;
        }

        var now = DateTime.UtcNow;

        var updatedRows = await dbContext.Database.ExecuteSqlInterpolatedAsync($"""
            WITH candidates AS (
                SELECT user_id
                FROM active_players
                WHERE game_type_id = {gameTypeId}
                    AND is_active = TRUE
                    AND is_playing = FALSE
                    AND user_id IN ({userId}, {matchedUserId})
                GROUP BY user_id
                FOR UPDATE
            ),
            candidate_count AS (
                SELECT COUNT(*) AS cnt FROM candidates
            )
            UPDATE active_players ap
            SET is_playing = TRUE,
                matched_user_id = CASE
                    WHEN ap.user_id = {userId} THEN {matchedUserId}
                    ELSE {userId}
                END,
                updated_by = {"system"},
                updated_at = {now}
            WHERE ap.game_type_id = {gameTypeId}
                AND ap.is_active = TRUE
                AND ap.is_playing = FALSE
                AND ap.matched_user_id IS NULL
                AND ap.user_id IN (SELECT user_id FROM candidates)
                AND (SELECT cnt FROM candidate_count) = 2;
            """, cancellationToken);

        return updatedRows >= 2;
    }
}
