# roster-management Specification

## Purpose

Allow the organizer to add, remove, and reorder players, with safeguards that protect players currently on a court and retain accumulated statistics after removal.

## Requirements

### Requirement: Add a player

The system SHALL allow the organizer to add a player by name. A newly added player SHALL be placed at the back of the queue.

#### Scenario: Add a late arrival

- **WHEN** the organizer adds a player with a name
- **THEN** the player is added to the roster and appended to the back of the queue

#### Scenario: Reject an empty name

- **WHEN** the organizer attempts to add a player without a name
- **THEN** the system does not add a player and prompts for a name

### Requirement: Remove a player

The system SHALL allow the organizer to remove a player who is in the queue. A player currently on a court SHALL NOT be removed until their game has ended or been voided.

#### Scenario: Remove a queued player

- **WHEN** the organizer removes a player who is currently in the queue
- **THEN** the player is removed from the queue and the remaining players keep their relative order

#### Scenario: Block removal of a playing player

- **WHEN** the organizer attempts to remove a player who is currently on a court
- **THEN** the system blocks the removal and indicates the player must finish or the game must be voided first

#### Scenario: Stats retained after removal

- **WHEN** a player with recorded statistics is removed from the queue
- **THEN** their accumulated statistics are retained

### Requirement: Reorder the queue

The system SHALL allow the organizer to manually change a queued player's position, including bumping a player toward the front or back. Reordering SHALL only affect players in the queue, never players currently on a court.

#### Scenario: Bump a player forward

- **WHEN** the organizer moves a queued player to an earlier position
- **THEN** the queue order updates to reflect the new position and other players shift accordingly

#### Scenario: Reorder excludes playing players

- **WHEN** the organizer reorders the queue
- **THEN** players currently on a court are not part of the reorderable queue
