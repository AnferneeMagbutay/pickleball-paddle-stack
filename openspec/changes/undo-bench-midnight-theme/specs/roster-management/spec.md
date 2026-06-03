## ADDED Requirements

### Requirement: Bench a player

The system SHALL allow the organizer to bench (pause) a player who is currently in the queue. A benched player SHALL be set aside — removed from the queue, not on a court, and not deleted — with their statistics retained. A player currently on a court SHALL NOT be benched until their game has ended or been voided. Benched players SHALL NOT be pulled into games.

#### Scenario: Bench a queued player

- **WHEN** the organizer benches a player who is currently in the queue
- **THEN** the player is removed from the queue, placed in the benched set, and is not eligible to be pulled into a game

#### Scenario: Block benching a playing player

- **WHEN** the organizer attempts to bench a player who is currently on a court
- **THEN** the system blocks the action and indicates the player must finish or the game must be voided first

#### Scenario: Benched player keeps stats

- **WHEN** a player with recorded statistics is benched
- **THEN** their accumulated statistics are retained

### Requirement: Resume a benched player

The system SHALL allow the organizer to resume a benched player. A resumed player SHALL be placed at the back of the queue.

#### Scenario: Resume to the back of the queue

- **WHEN** the organizer resumes a benched player
- **THEN** the player is removed from the benched set and appended to the back of the queue

## MODIFIED Requirements

### Requirement: Remove a player

The system SHALL allow the organizer to remove a player who is in the queue or benched. A player currently on a court SHALL NOT be removed until their game has ended or been voided.

#### Scenario: Remove a queued player

- **WHEN** the organizer removes a player who is currently in the queue
- **THEN** the player is removed from the queue and the remaining players keep their relative order

#### Scenario: Remove a benched player

- **WHEN** the organizer removes a player who is currently benched
- **THEN** the player is removed from the benched set

#### Scenario: Block removal of a playing player

- **WHEN** the organizer attempts to remove a player who is currently on a court
- **THEN** the system blocks the removal and indicates the player must finish or the game must be voided first

#### Scenario: Stats retained after removal

- **WHEN** a player with recorded statistics is removed
- **THEN** their accumulated statistics are retained
