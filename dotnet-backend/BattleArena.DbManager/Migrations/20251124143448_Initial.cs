using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BattleArena.DbManager.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "games",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    game_type = table.Column<string>(type: "varchar(32)", nullable: false),
                    game_status = table.Column<string>(type: "varchar(32)", nullable: false),
                    started_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    ended_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_games", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "organizations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    name = table.Column<string>(type: "varchar(512)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organizations", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "question_topic_categories",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "varchar(128)", nullable: false),
                    description = table.Column<string>(type: "varchar(512)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_topic_categories", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "teams",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_teams", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "organization_venues",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    name = table.Column<string>(type: "varchar(512)", nullable: false),
                    code = table.Column<string>(type: "varchar(8)", nullable: false),
                    organization_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organization_venues", x => x.id);
                    table.ForeignKey(
                        name: "FK_organization_venues_organizations_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organizations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    username = table.Column<string>(type: "varchar(255)", nullable: false),
                    first_name = table.Column<string>(type: "varchar(255)", nullable: false),
                    last_name = table.Column<string>(type: "varchar(255)", nullable: false),
                    email = table.Column<string>(type: "varchar(512)", nullable: true),
                    phone_number = table.Column<string>(type: "varchar(32)", nullable: true),
                    OrganizationId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                    table.ForeignKey(
                        name: "FK_users_organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "organizations",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "question_topics",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "varchar(128)", nullable: false),
                    description = table.Column<string>(type: "varchar(512)", nullable: true),
                    question_topic_category_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_topics", x => x.id);
                    table.ForeignKey(
                        name: "FK_question_topics_question_topic_categories_question_topic_ca~",
                        column: x => x.question_topic_category_id,
                        principalTable: "question_topic_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "organization_venue_events",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    name = table.Column<string>(type: "varchar(512)", nullable: false),
                    organization_venue_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organization_venue_events", x => x.id);
                    table.ForeignKey(
                        name: "FK_organization_venue_events_organization_venues_organization_~",
                        column: x => x.organization_venue_id,
                        principalTable: "organization_venues",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "organization_hosts",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    organization_id = table.Column<int>(type: "integer", nullable: false),
                    host_id = table.Column<int>(type: "integer", nullable: false),
                    role = table.Column<string>(type: "varchar(32)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_organization_hosts", x => x.id);
                    table.ForeignKey(
                        name: "FK_organization_hosts_organizations_organization_id",
                        column: x => x.organization_id,
                        principalTable: "organizations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_organization_hosts_users_host_id",
                        column: x => x.host_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "team_players",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    team_id = table.Column<int>(type: "integer", nullable: false),
                    player_id = table.Column<int>(type: "integer", nullable: false),
                    role = table.Column<string>(type: "varchar(32)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_team_players", x => x.id);
                    table.ForeignKey(
                        name: "FK_team_players_teams_team_id",
                        column: x => x.team_id,
                        principalTable: "teams",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_team_players_users_player_id",
                        column: x => x.player_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "game_rounds",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    number = table.Column<int>(type: "integer", nullable: false),
                    game_id = table.Column<int>(type: "integer", nullable: false),
                    question_topic_id = table.Column<int>(type: "integer", nullable: false),
                    game_round_status = table.Column<string>(type: "varchar(32)", nullable: false),
                    point_multiplier = table.Column<int>(type: "integer", nullable: false),
                    started_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    ended_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_game_rounds", x => x.id);
                    table.ForeignKey(
                        name: "FK_game_rounds_games_game_id",
                        column: x => x.game_id,
                        principalTable: "games",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_game_rounds_question_topics_question_topic_id",
                        column: x => x.question_topic_id,
                        principalTable: "question_topics",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "questions",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    question_type = table.Column<string>(type: "varchar(32)", nullable: false),
                    question_answer_type = table.Column<string>(type: "varchar(32)", nullable: false),
                    question_topic_id = table.Column<int>(type: "integer", nullable: false),
                    text = table.Column<string>(type: "varchar(1032)", nullable: false),
                    image_url = table.Column<string>(type: "varchar(1032)", nullable: false),
                    audio_url = table.Column<string>(type: "varchar(1032)", nullable: false),
                    video_url = table.Column<string>(type: "varchar(1032)", nullable: false),
                    correct_answer_text = table.Column<string>(type: "varchar(1032)", nullable: true),
                    points = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_questions", x => x.id);
                    table.ForeignKey(
                        name: "FK_questions_question_topics_question_topic_id",
                        column: x => x.question_topic_id,
                        principalTable: "question_topics",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "question_choices",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    question_id = table.Column<int>(type: "integer", nullable: false),
                    position = table.Column<int>(type: "integer", nullable: false),
                    choice = table.Column<string>(type: "varchar(1032)", nullable: false),
                    is_correct_choice = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_question_choices", x => x.id);
                    table.ForeignKey(
                        name: "FK_question_choices_questions_question_id",
                        column: x => x.question_id,
                        principalTable: "questions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_game_rounds_game_id",
                table: "game_rounds",
                column: "game_id");

            migrationBuilder.CreateIndex(
                name: "IX_game_rounds_question_topic_id",
                table: "game_rounds",
                column: "question_topic_id");

            migrationBuilder.CreateIndex(
                name: "IX_organization_hosts_host_id",
                table: "organization_hosts",
                column: "host_id");

            migrationBuilder.CreateIndex(
                name: "IX_organization_hosts_organization_id",
                table: "organization_hosts",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "IX_organization_venue_events_organization_venue_id",
                table: "organization_venue_events",
                column: "organization_venue_id");

            migrationBuilder.CreateIndex(
                name: "IX_organization_venues_code",
                table: "organization_venues",
                column: "code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_organization_venues_organization_id",
                table: "organization_venues",
                column: "organization_id");

            migrationBuilder.CreateIndex(
                name: "IX_question_choices_question_id",
                table: "question_choices",
                column: "question_id");

            migrationBuilder.CreateIndex(
                name: "IX_question_topics_question_topic_category_id",
                table: "question_topics",
                column: "question_topic_category_id");

            migrationBuilder.CreateIndex(
                name: "IX_questions_question_topic_id",
                table: "questions",
                column: "question_topic_id");

            migrationBuilder.CreateIndex(
                name: "IX_team_players_player_id",
                table: "team_players",
                column: "player_id");

            migrationBuilder.CreateIndex(
                name: "IX_team_players_team_id",
                table: "team_players",
                column: "team_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_OrganizationId",
                table: "users",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_users_username",
                table: "users",
                column: "username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "game_rounds");

            migrationBuilder.DropTable(
                name: "organization_hosts");

            migrationBuilder.DropTable(
                name: "organization_venue_events");

            migrationBuilder.DropTable(
                name: "question_choices");

            migrationBuilder.DropTable(
                name: "team_players");

            migrationBuilder.DropTable(
                name: "games");

            migrationBuilder.DropTable(
                name: "organization_venues");

            migrationBuilder.DropTable(
                name: "questions");

            migrationBuilder.DropTable(
                name: "teams");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "question_topics");

            migrationBuilder.DropTable(
                name: "organizations");

            migrationBuilder.DropTable(
                name: "question_topic_categories");
        }
    }
}
