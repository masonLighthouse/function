## Function

Function is a todo application based on the MIT productivity system (most important thing, todo, backburner).

This is an active side-project with estimated completion by May 1, 2021.

## Stack

- Angular 11+ (TS, RxJS, Firestore)
- Ionic (allows for browser, and native iOS/Android application development with the same codebase)
- Firestore (basic noSQL nested collections, and batch-writes)

## Features

- MIT todo system
- Integrations with Google Calendar (voice-activated reminders with google now added to backburner section, removing friction)
- Draggable elements between todo and backburner section

## Premium features

These features are not a part of function yet, but they are on the roadmap.

- Task analytics (indluding tracking 'nomadic' tasks that go from task to task)
- Kanban-style task maangement between todo lists
- Tagging
- Task suggestions

## How to run

- Clone repo
- Run `npm install` and install all necessary dependencies
- Run `ionic serve`

## Current status

- Authentication and routing works
- Dragging elements within todo and backburner sections work
- Marking a task as done, chaning the name of the task, and deleting tasks all work (wired up to the backend).
- Total application size: ~970k
