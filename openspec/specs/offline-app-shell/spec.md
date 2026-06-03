# offline-app-shell Specification

## Purpose

Deliver the app as an installable Progressive Web App that operates fully offline after first load and persists all state locally on the device with no server or account.

## Requirements

### Requirement: Installable PWA

The system SHALL be installable to a mobile device home screen as a Progressive Web App, with a web app manifest (name, icons, display mode) and a registered service worker.

#### Scenario: Add to home screen

- **WHEN** the organizer opens the app in a supporting mobile browser and chooses to install or add to home screen
- **THEN** the app installs with its name and icon and launches in a standalone, full-screen mode

### Requirement: Offline operation

After the first load, the system SHALL function fully without a network connection. All application assets SHALL be cached so the app loads and operates offline.

#### Scenario: Launch with no network

- **WHEN** the app has been loaded once and is later opened with no network connection
- **THEN** the app loads and all queue, roster, and stats functions work normally

### Requirement: Local persistence of state

The system SHALL persist all application state (roster, queue, court assignments, and statistics) on the device so it survives app reloads and restarts. State SHALL be stored locally with no server or account.

#### Scenario: State survives a reload

- **WHEN** the organizer reloads or relaunches the app
- **THEN** the previously saved roster, queue order, in-progress courts, and statistics are restored

#### Scenario: No network calls at runtime

- **WHEN** the app performs any operation
- **THEN** it does not send application data to a server or require authentication
