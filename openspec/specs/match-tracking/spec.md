# match-tracking Specification

## Purpose

Record game results with a single tap, track per-player win/loss/games-played statistics and derived win percentage, present a leaderboard, and keep statistics decoupled from queue ordering and partner assignment.

## Requirements

### Requirement: Record a game result

When a game ends, the system SHALL prompt the organizer to select the winning team and record the outcome with a single tap. Numeric scores SHALL NOT be required.

#### Scenario: Tap the winning team

- **WHEN** a game ends and the organizer taps one team as the winner
- **THEN** the system records that team as the winner and the other as the loser for that game

#### Scenario: End without recording a winner

- **WHEN** the organizer ends a game without selecting a winner (a voided game)
- **THEN** the court is freed and players return to the queue, but no win or loss is recorded

### Requirement: Per-player statistics

The system SHALL track statistics per individual player: wins, losses, and games played. Win percentage SHALL be derived from these values. Statistics SHALL be attributed to individuals, not to teams.

#### Scenario: Update stats on a recorded result

- **WHEN** a game result is recorded with a winning team
- **THEN** each of the 2 winning players gains one win and one game played, and each of the 2 losing players gains one loss and one game played

#### Scenario: Win percentage derivation

- **WHEN** a player's wins and games played are known
- **THEN** the player's win percentage is wins divided by games played, shown as 0 when no games have been played

### Requirement: Leaderboard

The system SHALL provide a leaderboard ranking players by their statistics.

#### Scenario: Display ranked players

- **WHEN** the organizer opens the leaderboard
- **THEN** the system lists players with their wins, losses, games played, and win percentage, ranked by record

### Requirement: Stats decoupled from queue ordering

Statistics SHALL NOT influence queue position or partner assignment in any way.

#### Scenario: Stats do not affect the queue

- **WHEN** any game result is recorded
- **THEN** the queue order and future partner randomization are unaffected by the recorded statistics
