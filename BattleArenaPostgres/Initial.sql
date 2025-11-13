
create table GameTypes (
    GameTypeld int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    GameType VARCHAR (100) NOT NULL
);

create table Players (
    PlayerId BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    UserName VARCHAR(100) NULL,
    FirstName VARCHAR(100) NULL,
    LastName VARCHAR(100) NULL,
    PhoneNumber VARCHAR (15) NULL,
    EmailAddress VARCHAR (100) NULL,
    CreatedDate DATE DEFAULT CURRENT_DATE,
    CreatedBy VARCHAR (100) NOT NULL,
    UpdatedDate DATE NULL,
    UpdatedBy VARCHAR (100) NULL
);

create table PlayerStats (
    PlayerStatId int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PlayerId BIGINT NOT NULL,
    GameTypeld INT NOT NULL,
    WinCount INT DEFAULT 0,
    LossCount INT DEFAULT 0,
    CreatedDate DATE DEFAULT CURRENT_DATE,
    UpdatedDate DATE NULL
);

Create table Games (
    GameId BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    GameTypeld int NOT NULL,
    CreatedDate DATE DEFAULT CURRENT_DATE,
    CreatedBy BIGINT NOT NULL,
    GameStartedOn DATE NULL,
    GameEndedOn DATE NULL
);

create table GamePlayers (
    GamePlayerId BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    GameId BIGINT NOT NULL,
    PlayerId BIGINT NOT NULL,
    IsWinner BIT NULL,
    GameStartedOn DATE NULL,
    GameEndedon DATE NULL,
    GameDurationMilsec INT NULL
);

create table QuestionTopics (
    QuestionTopicId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    QuestionTopic VARCHAR(100) NOT NULL
);

create table Questions (
    QuestionId BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    QuestionTopicId INT NOT NULL,
    Question VARCHAR(250) NOT NULL
);

create table Answers (
    Answerld BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    QuestionId BIGINT NOT NULL,
    Answer VARCHAR (250) NOT NULL,
    IsCorrectAnswer BIT NULL
);

create table GameQuestions (
    GameQuestionId BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    GameId BIGINT NOT NULL,
    QuestionId BIGINT NOT NULL
);