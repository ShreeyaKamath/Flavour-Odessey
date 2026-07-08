# Game Architecture

## MVP Scope

The playable MVP is Joy Meadow only. The loop is:

1. Enter Joy Meadow.
2. Meet Lumi and local NPCs.
3. Collect `vanilla_orchid` and `honey_bloom`.
4. Start `Restore the First Scoop`.
5. Craft `Golden Vanilla Bloom`.
6. Restore Joy Meadow.
7. Create the journal memory `The Day Joy Returned`.
8. Save and reload progress.

## Frontend Systems

- `features/game/` owns the gameplay screen and hooks.
- `components/crafting/` owns the magical crafting presentation.
- `components/lumi/` owns the floating companion UI.
- `components/npcs/` owns NPC presentation.
- `components/world/` owns the Joy Meadow environment.
- `features/showcase/` owns demo-only portfolio presentation.

## Backend Systems

- Auth owns identity and sessions.
- World owns islands, weather, restoration, and locked metadata.
- Inventory owns ingredient collection.
- Quest owns start/progress/complete state.
- Recipe owns crafting validation.
- Journal owns memory creation.

## Non-Goals

Version 1.0 does not include multiplayer, new islands, combat, economy, full festivals, real final art, or production LLM dependency.
