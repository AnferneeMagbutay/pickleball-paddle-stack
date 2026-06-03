## ADDED Requirements

### Requirement: Undo the last game end

The system SHALL allow the organizer to undo the most recent game end with a single action. Undoing SHALL restore the court that game was played on to a playing state with the same two teams, and SHALL remove those four players from the back of the queue where ending the game placed them. Only the single most recent game end SHALL be undoable; once any other queue or court action occurs, the previous game end SHALL no longer be undoable.

#### Scenario: Undo restores the court and queue

- **WHEN** a game has just ended and the organizer chooses to undo
- **THEN** the court returns to playing with the same team A and team B, and those four players are removed from the queue

#### Scenario: Undo is only available immediately after a game end

- **WHEN** no game has ended, or another queue or court action has occurred since the last game end
- **THEN** the undo action is not available

#### Scenario: Only one step of undo

- **WHEN** the organizer undoes a game end
- **THEN** there is nothing further to undo until another game ends

## MODIFIED Requirements

### Requirement: Small-group back-to-back warning

The system SHALL warn the organizer when the number of players available to play is too small to avoid players competing in consecutive games for the configured number of courts. Players who are benched SHALL NOT count toward the available total, since they are not in rotation.

#### Scenario: Group too small for one court

- **WHEN** one court is active and fewer than 8 available players are present (queued plus on court, excluding benched)
- **THEN** the system displays a non-blocking warning that back-to-back games are unavoidable

#### Scenario: Group large enough

- **WHEN** one court is active and at least 8 available players are present
- **THEN** no back-to-back warning is shown

#### Scenario: Benched players are excluded from the count

- **WHEN** benching a player drops the available count below the threshold
- **THEN** the warning is shown based on the available players, not counting the benched player
