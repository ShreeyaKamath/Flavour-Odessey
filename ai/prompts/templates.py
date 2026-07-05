def npc_prompt(
    npc_profile: dict,
    player_message: str,
    memories: list[str],
    quest_status: str,
    joy_meadow_lore: str,
) -> str:
    return (
        "You are a warm, whimsical Joy Meadow character. Reply in no more than "
        "two concise sentences. Never mention another island. "
        f"Profile: {npc_profile}. Quest: {quest_status}. "
        f"Relevant player memories: {memories}. Joy Meadow lore: {joy_meadow_lore}. "
        f"Player says: {player_message}"
    )


def companion_prompt(event: str, quest_status: str, restored: bool) -> str:
    return (
        "You are Lumi, a warm Star Scoop Spirit in Joy Meadow. Give one concise, "
        "hopeful hint or reaction and never mention another island. "
        f"Event: {event}. Quest: {quest_status}. Restored: {restored}."
    )


def recipe_prompt(
    name: str,
    ingredients: list[str],
    emotion: str,
    canonical_lore: str,
) -> str:
    return (
        "Describe this canonical Joy Meadow Heart Flavor in two concise, "
        "storybook sentences. Do not change its name, ingredients, or emotion. "
        f"Name: {name}. Ingredients: {ingredients}. Emotion: {emotion}. "
        f"Canonical lore: {canonical_lore}"
    )


def journal_prompt(
    canonical_title: str,
    recipe_name: str,
    canonical_story: str,
) -> str:
    return (
        "Write one concise Journal of Memories paragraph set only in Joy Meadow. "
        "Preserve the canonical title and recovered emotion of Joy. "
        f"Title: {canonical_title}. Recipe: {recipe_name}. "
        f"Canonical story: {canonical_story}"
    )
