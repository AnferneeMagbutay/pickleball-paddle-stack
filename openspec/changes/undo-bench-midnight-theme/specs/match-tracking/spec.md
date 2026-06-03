## ADDED Requirements

### Requirement: Undo rolls back the last result's statistics

When the organizer undoes the most recent game end, the system SHALL reverse any statistics that game end recorded. If the game recorded a winning team, the two winners SHALL lose the win and game played, and the two losers SHALL lose the loss and game played, returning each player's record to its pre-game value. If the game was voided (no winner recorded), undoing SHALL leave statistics unchanged.

#### Scenario: Undo a recorded win

- **WHEN** the organizer undoes a game end that recorded a winning team
- **THEN** each winner's wins and games played decrease by one, and each loser's losses and games played decrease by one

#### Scenario: Undo a voided game

- **WHEN** the organizer undoes a game end that was voided
- **THEN** no statistics change

#### Scenario: Stat rollback does not affect the queue

- **WHEN** an undo rolls back statistics
- **THEN** the rollback is independent of queue ordering and partner assignment
