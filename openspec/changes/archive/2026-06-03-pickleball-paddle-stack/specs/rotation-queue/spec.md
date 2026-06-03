## ADDED Requirements

### Requirement: Shared queue feeds open courts

The system SHALL maintain a single ordered queue of players that feeds one or two courts. The number of active courts SHALL be configurable as 1 or 2. The front of the queue is the next player to play.

#### Scenario: Start a game on an open court

- **WHEN** a court is open and the queue contains at least 4 players
- **THEN** the system removes the front 4 players from the queue and assigns them to that court as a playing game

#### Scenario: Not enough players to start

- **WHEN** a court is open and the queue contains fewer than 4 players
- **THEN** the system does not start a game and indicates that at least 4 queued players are required

#### Scenario: Two courts draw from the same queue

- **WHEN** both courts are open and the queue contains at least 8 players
- **THEN** starting a game on each court removes 4 players per court from the front of the queue in turn, leaving the remainder queued in order

### Requirement: Partners are randomized each game

When a game starts, the system SHALL randomly assign the 4 pulled players into two teams of two. Partner assignment SHALL be independent of any prior pairing or player statistics.

#### Scenario: Four players split into two random teams

- **WHEN** 4 players are pulled to an open court
- **THEN** the system shuffles them and forms two 2-player teams (team A and team B)

### Requirement: Result-blind rotation returns players to the back

When a game ends, the system SHALL return all 4 players who played to the back of the queue, regardless of which team won. Queue ordering SHALL NOT be influenced by the game result.

#### Scenario: Players re-enter the queue after a game

- **WHEN** a game on a court ends
- **THEN** all 4 players are appended to the back of the queue and the court becomes open

#### Scenario: Winning does not grant court priority

- **WHEN** a game ends and the winning team is recorded
- **THEN** the winning players are placed at the back of the queue in the same manner as the losing players, with no priority for the next game

### Requirement: Small-group back-to-back warning

The system SHALL warn the organizer when the total number of players is too small to avoid players competing in consecutive games for the configured number of courts.

#### Scenario: Group too small for one court

- **WHEN** one court is active and fewer than 8 total players are present (queued plus on court)
- **THEN** the system displays a non-blocking warning that back-to-back games are unavoidable

#### Scenario: Group large enough

- **WHEN** one court is active and at least 8 players are present
- **THEN** no back-to-back warning is shown
