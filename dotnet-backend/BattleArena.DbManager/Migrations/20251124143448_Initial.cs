using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BattleArena.DbManager.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "arenas",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    arena_name = table.Column<string>(type: "text", nullable: false),
                    arena_code = table.Column<string>(type: "text", nullable: false),
                    arena_owner = table.Column<int>(type: "integer", nullable: false),
                    wager_amount = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(type: "varchar(32)", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_arenas", x => x.id); });

            migrationBuilder.CreateTable(
                name: "arena_players",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    arena_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(type: "varchar(32)", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_arena_players", x => x.id); });

            migrationBuilder.CreateTable(
                name: "trivia_game_questions",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    game_id = table.Column<long>(type: "bigint", nullable: false),
                    question_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_trivia_game_questions", x => x.id); });

            migrationBuilder.CreateTable(
                name: "trivia_game_choices",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    game_id = table.Column<long>(type: "bigint", nullable: false),
                    question_id = table.Column<int>(type: "integer", nullable: false),
                    choice_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_trivia_game_choices", x => x.id); });

            migrationBuilder.CreateTable(
                name: "trivia_game_results",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    game_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    number_of_correct_answers = table.Column<int>(type: "integer", nullable: false),
                    time_taken_in_seconds = table.Column<int>(type: "integer", nullable: false),
                    is_winner = table.Column<bool>(type: "boolean", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_trivia_game_results", x => x.id); });

            migrationBuilder.CreateTable(
                name: "trivia_game_result_details",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    game_id = table.Column<long>(type: "bigint", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    question_id = table.Column<int>(type: "integer", nullable: false),
                    choice_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_trivia_game_result_details", x => x.id); });

            migrationBuilder.CreateTable(
                name: "game_types",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    game_name = table.Column<string>(type: "varchar(100)", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_game_types", x => x.id); });

            migrationBuilder.CreateTable(
                name: "games",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    game_type_id = table.Column<int>(type: "integer", nullable: false),
                    arena_id = table.Column<int>(type: "integer", nullable: false),
                    question_topic_id = table.Column<int>(type: "integer", nullable: false),
                    started_by = table.Column<long>(type: "bigint", nullable: false),
                    wager = table.Column<int>(type: "integer", nullable: false),
                    game_status = table.Column<string>(type: "varchar(32)", nullable: false),
                    started_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    ended_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_games", x => x.id); });

            migrationBuilder.CreateTable(
                name: "organizations",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    name = table.Column<string>(type: "varchar(512)", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_organizations", x => x.id); });

            migrationBuilder.CreateTable(
                name: "question_topic_categories",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "varchar(128)", nullable: false),
                    description = table.Column<string>(type: "varchar(512)", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_question_topic_categories", x => x.id); });

            migrationBuilder.CreateTable(
                name: "teams",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    name = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_teams", x => x.id); });

            migrationBuilder.CreateTable(
                name: "active_players",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    game_type_id = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    is_playing = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_active_players", x => x.id); });

            migrationBuilder.CreateTable(
                name: "favorite_players",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    game_type_id = table.Column<int>(type: "integer", nullable: false),
                    favorite_user_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_favorite_players", x => x.id); });

            migrationBuilder.CreateTable(
                name: "wagers",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    game_type_id = table.Column<int>(type: "integer", nullable: false),
                    wager_amount = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_wagers", x => x.id); });

            migrationBuilder.CreateTable(
                name: "wins_losses",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<long>(type: "bigint", nullable: false),
                    game_type_id = table.Column<int>(type: "integer", nullable: false),
                    wins = table.Column<int>(type: "integer", nullable: false),
                    losses = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table => { table.PrimaryKey("PK_wins_losses", x => x.id); });

            migrationBuilder.CreateTable(
                name: "organization_venues",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
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
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    created_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    created_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "time with time zone", nullable: false),
                    updated_by = table.Column<string>(type: "varchar(255)", nullable: false),
                    username = table.Column<string>(type: "varchar(255)", nullable: false),
                    first_name = table.Column<string>(type: "varchar(255)", nullable: false),
                    last_name = table.Column<string>(type: "varchar(255)", nullable: false),
                    email = table.Column<string>(type: "varchar(512)", nullable: true),
                    phone_number = table.Column<string>(type: "varchar(32)", nullable: true),
                    amount = table.Column<int>(type: "integer", nullable: true),
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
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
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
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
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
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
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
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
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
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
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
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
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
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    question_id = table.Column<int>(type: "integer", nullable: false),
                    position = table.Column<int>(type: "integer", nullable: false),
                    text = table.Column<string>(type: "varchar(1032)", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "game_round_answers",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    game_round_id = table.Column<int>(type: "integer", nullable: false),
                    question_id = table.Column<int>(type: "integer", nullable: false),
                    team_id = table.Column<int>(type: "integer", nullable: true),
                    standard_answer = table.Column<string>(type: "varchar(1032)", nullable: true),
                    question_choice_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_game_round_answers", x => x.id);
                    table.ForeignKey(
                        name: "FK_game_round_answers_game_rounds_game_round_id",
                        column: x => x.game_round_id,
                        principalTable: "game_rounds",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_game_round_answers_question_choices_question_choice_id",
                        column: x => x.question_choice_id,
                        principalTable: "question_choices",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_game_round_answers_questions_question_id",
                        column: x => x.question_id,
                        principalTable: "questions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_game_round_answers_teams_team_id",
                        column: x => x.team_id,
                        principalTable: "teams",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "game_round_answer_votes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy",
                            NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    game_round_id = table.Column<int>(type: "integer", nullable: false),
                    question_id = table.Column<int>(type: "integer", nullable: false),
                    player_id = table.Column<int>(type: "integer", nullable: false),
                    standard_answer = table.Column<string>(type: "varchar(1032)", nullable: true),
                    question_choice_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_game_round_answer_votes", x => x.id);
                    table.ForeignKey(
                        name: "FK_game_round_answer_votes_game_rounds_game_round_id",
                        column: x => x.game_round_id,
                        principalTable: "game_rounds",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_game_round_answer_votes_question_choices_question_choice_id",
                        column: x => x.question_choice_id,
                        principalTable: "question_choices",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_game_round_answer_votes_questions_question_id",
                        column: x => x.question_id,
                        principalTable: "questions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_game_round_answer_votes_users_player_id",
                        column: x => x.player_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_game_rounds_game_id",
                table: "game_rounds",
                column: "game_id");

            migrationBuilder.CreateIndex(
                name: "IX_game_round_answers_game_round_id",
                table: "game_round_answers",
                column: "game_round_id");

            migrationBuilder.CreateIndex(
                name: "IX_game_round_answers_question_choice_id",
                table: "game_round_answers",
                column: "question_choice_id");

            migrationBuilder.CreateIndex(
                name: "IX_game_round_answers_question_id",
                table: "game_round_answers",
                column: "question_id");

            migrationBuilder.CreateIndex(
                name: "IX_game_round_answers_team_id",
                table: "game_round_answers",
                column: "team_id");

            migrationBuilder.CreateIndex(
                name: "IX_game_round_answer_votes_game_round_id",
                table: "game_round_answer_votes",
                column: "game_round_id");

            migrationBuilder.CreateIndex(
                name: "IX_game_round_answer_votes_player_id",
                table: "game_round_answer_votes",
                column: "player_id");

            migrationBuilder.CreateIndex(
                name: "IX_game_round_answer_votes_question_choice_id",
                table: "game_round_answer_votes",
                column: "question_choice_id");

            migrationBuilder.CreateIndex(
                name: "IX_game_round_answer_votes_question_id",
                table: "game_round_answer_votes",
                column: "question_id");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "arenas");
            migrationBuilder.DropTable(name: "arena_players");
            migrationBuilder.DropTable(name: "trivia_game_choices");
            migrationBuilder.DropTable(name: "trivia_game_questions");
            migrationBuilder.DropTable(name: "trivia_game_result_details");
            migrationBuilder.DropTable(name: "trivia_game_results");
            migrationBuilder.DropTable(name: "game_round_answers");
            migrationBuilder.DropTable(name: "game_round_answer_votes");
            migrationBuilder.DropTable(name: "active_players");
            migrationBuilder.DropTable(name: "favorite_players");
            migrationBuilder.DropTable(name: "wagers");
            migrationBuilder.DropTable(name: "WinsLosses");
            migrationBuilder.DropTable(name: "game_rounds");
            migrationBuilder.DropTable(name: "organization_hosts");
            migrationBuilder.DropTable(name: "organization_venue_events");
            migrationBuilder.DropTable(name: "question_choices");
            migrationBuilder.DropTable(name: "team_players");
            migrationBuilder.DropTable(name: "games");
            migrationBuilder.DropTable(name: "game_types");
            migrationBuilder.DropTable(name: "organization_venues");
            migrationBuilder.DropTable(name: "questions");
            migrationBuilder.DropTable(name: "teams");
            migrationBuilder.DropTable(name: "users");
            migrationBuilder.DropTable(name: "question_topics");
            migrationBuilder.DropTable(name: "organizations");
            migrationBuilder.DropTable(name: "question_topic_categories");
        }
    }
}
