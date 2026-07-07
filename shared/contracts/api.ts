/* Generated from shared/openapi/openapi.json. Do not edit manually. */

export type components = {
  schemas: {
    AICompanionRespondRequest: {
      event:
        "hint" | "ingredient_collected" | "recipe_crafted" | "joy_restored";
    };
    AICompanionRespondResponse: {
      companion_id: "lumi";
      event: string;
      fallback_used: boolean;
      provider: string;
      response: string;
    };
    AIJournalStoryRequest: {
      island_id: "joy_meadow";
    };
    AIJournalStoryResponse: {
      fallback_used: boolean;
      island_id: "joy_meadow";
      provider: string;
      story: string;
      title: "The Day Joy Returned";
    };
    AINpcChatRequest: {
      message: string;
      npc_id:
        | "joy_meadow_keeper"
        | "joy_meadow_baker"
        | "joy_meadow_gardener"
        | "joy_meadow_child_explorer"
        | "joy_meadow_traveling_merchant";
    };
    AINpcChatResponse: {
      fallback_used: boolean;
      importance: number;
      memory_written: boolean;
      mood: string;
      npc_id:
        | "joy_meadow_keeper"
        | "joy_meadow_baker"
        | "joy_meadow_gardener"
        | "joy_meadow_child_explorer"
        | "joy_meadow_traveling_merchant";
      provider: string;
      relationship?: components["schemas"]["NpcRelationshipState"] | null;
      reply: string;
    };
    AIRecipeDescribeRequest: {
      recipe_id: "golden_vanilla_bloom";
    };
    AIRecipeDescribeResponse: {
      emotion: "joy";
      fallback_used: boolean;
      lore: string;
      name: "Golden Vanilla Bloom";
      provider: string;
      recipe_id: "golden_vanilla_bloom";
      required_ingredients: Array<"vanilla_orchid" | "honey_bloom">;
    };
    AmbientMetadata: {
      description: string;
      palette: Array<string>;
      sounds: Array<string>;
    };
    AuthSessionResponse: {
      access_token: string;
      expires_at: string;
      refresh_token: string;
      token_type?: "bearer";
      user: components["schemas"]["AuthUser"];
      user_id: string;
    };
    AuthUser: {
      display_name: string;
      email: string | null;
      id: string;
      is_guest: boolean;
    };
    DialogueResponse: {
      character_id: string;
      character_name: string;
      role: "companion" | "npc";
      text: string;
    };
    ErrorCode:
      | "AUTH_CONFIGURATION_ERROR"
      | "INVALID_INPUT"
      | "HTTP_ERROR"
      | "NOT_FOUND"
      | "CONFLICT"
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "INTERNAL_ERROR";
    ErrorDetail: {
      code: components["schemas"]["ErrorCode"] | string;
      message: string;
    };
    ErrorResponse: {
      error: components["schemas"]["ErrorDetail"];
    };
    EventType:
      | "PlayerLoggedIn"
      | "QuestStarted"
      | "QuestProgressUpdated"
      | "QuestCompleted"
      | "IngredientCollected"
      | "RecipeCrafted"
      | "EmotionRestored"
      | "IslandUnlocked"
      | "NPCFriendshipChanged"
      | "NPCMemoryWritten"
      | "WeatherChanged"
      | "JournalUpdated"
      | "CompanionReacted"
      | "CompanionEvolved"
      | "SettingsUpdated"
      | "SaveCompleted";
    GameEvent: {
      event_id?: string | null;
      occurred_at?: string | null;
      payload?: Record<string, unknown>;
      type: components["schemas"]["EventType"];
    };
    GameIslandState: {
      island_id: "joy_meadow";
      name: "Joy Meadow";
      restoration_level: number;
      restored: boolean;
    };
    GameStartRequest: {
      island_id?: "joy_meadow";
    };
    GameStateResponse: {
      dialogue: Array<components["schemas"]["DialogueResponse"]>;
      inventory: Array<components["schemas"]["InventoryItemResponse"]>;
      island: components["schemas"]["GameIslandState"];
      journal: Array<components["schemas"]["JournalEntryResponse"]>;
      quest: components["schemas"]["QuestStateResponse"];
      recipe: components["schemas"]["RecipeStateResponse"];
      save: components["schemas"]["SaveStatusResponse"];
      started: boolean;
    };
    GuestLoginRequest: {
      display_name?: string | null;
    };
    HTTPValidationError: {
      detail?: Array<components["schemas"]["ValidationError"]>;
    };
    HealthResponse: {
      service: "flavor-odyssey-backend";
      status: "ok";
    };
    InventoryCollectRequest: {
      ingredient_id: "vanilla_orchid" | "honey_bloom";
    };
    InventoryItemResponse: {
      collected: boolean;
      ingredient_id: "vanilla_orchid" | "honey_bloom";
      name: string;
      quantity: number;
    };
    InventoryResponse: {
      items: Array<components["schemas"]["InventoryItemResponse"]>;
    };
    IslandSummary: {
      ambient: components["schemas"]["AmbientMetadata"];
      availability: "playable" | "coming_in_version_1";
      description: string;
      emotion: string;
      id: string;
      key: string;
      landmarks: Array<components["schemas"]["LandmarkResponse"]>;
      manifests: Array<components["schemas"]["ManifestReference"]>;
      map_order: number;
      map_position: components["schemas"]["WorldMapPosition"];
      name: string;
      restoration_level: number;
      restoration_state: "unrestored" | "restoring" | "restored";
      unlocked: boolean;
    };
    IslandsResponse: {
      items: Array<components["schemas"]["IslandSummary"]>;
    };
    JournalCreateRequest: {
      island_id: "joy_meadow";
    };
    JournalEntryResponse: {
      content: string;
      created_at: string;
      emotion: string;
      id: string;
      recipe_name: string | null;
      title: string;
    };
    JournalResponse: {
      items: Array<components["schemas"]["JournalEntryResponse"]>;
    };
    LandmarkResponse: {
      description: string;
      key: string;
      name: string;
    };
    LoginRequest: {
      email: string;
      password: string;
    };
    LogoutRequest: {
      refresh_token?: string | null;
    };
    LogoutResponse: {
      logged_out: boolean;
    };
    ManifestReference: {
      key: string;
      manifest_type: "asset" | "audio";
      path: string;
    };
    MeResponse: {
      user: components["schemas"]["AuthUser"];
    };
    NpcChatRequest: {
      message: string;
      npc_id: string;
    };
    NpcChatResponse: {
      memory_written: boolean;
      mood: string;
      reply: string;
    };
    NpcConversationTurn: {
      mood: string;
      occurred_at: string;
      speaker: "player" | "npc";
      text: string;
    };
    NpcGiftPreferences: {
      avoids: Array<string>;
      likes: Array<string>;
      loves: Array<string>;
    };
    NpcGiftRequest: {
      gift_id: string;
    };
    NpcGiftResponse: {
      friendship_delta: number;
      npc_id:
        | "joy_meadow_keeper"
        | "joy_meadow_baker"
        | "joy_meadow_gardener"
        | "joy_meadow_child_explorer"
        | "joy_meadow_traveling_merchant";
      reaction: string;
      relationship: components["schemas"]["NpcRelationshipState"];
      trust_delta: number;
    };
    NpcMovementState: {
      from_location: string;
      no_teleporting?: true;
      progress: number;
      to_location: string;
    };
    NpcRelationshipState: {
      conversation_history: Array<components["schemas"]["NpcConversationTurn"]>;
      friendship_level: number;
      friendship_xp: number;
      memory_highlights: Array<string>;
      milestones: Array<string>;
      relationship_status: string;
      trust_level: number;
      trust_xp: number;
    };
    NpcScheduleStep: {
      activity: string;
      label: string;
      location: string;
      starts_at: string;
    };
    NpcStateResponse: {
      age_group: string;
      animation_state: string;
      current_activity: string;
      current_goal: string;
      current_location: string;
      current_mood: string;
      daily_schedule: Array<components["schemas"]["NpcScheduleStep"]>;
      emotion_icon: string;
      energy_level: number;
      favorite_flavor: string;
      favorite_flower: string;
      favorite_weather: string;
      gift_preferences: components["schemas"]["NpcGiftPreferences"];
      id: string;
      lumi_reaction: string;
      memory_summary: string;
      movement: components["schemas"]["NpcMovementState"];
      name: string;
      npc_id:
        | "joy_meadow_keeper"
        | "joy_meadow_baker"
        | "joy_meadow_gardener"
        | "joy_meadow_child_explorer"
        | "joy_meadow_traveling_merchant";
      occupation: string;
      personality: Array<string>;
      portrait: string;
      relationship: components["schemas"]["NpcRelationshipState"];
      speech_bubble: string;
      speech_speed: "slow" | "normal" | "bright" | "dreamy";
      thought_bubble: string;
      voice_style: string;
    };
    NpcsResponse: {
      items: Array<components["schemas"]["NpcStateResponse"]>;
    };
    PaginationMeta: {
      has_more: boolean;
      limit: number;
      offset: number;
      total: number;
    };
    PaginationParams: {
      limit?: number;
      offset?: number;
    };
    PlayerProfileResponse: {
      companion?: Record<string, unknown>;
      current_island: string;
      id: string;
      player_name: string;
    };
    PlayerProfileUpdateRequest: {
      current_island?: string | null;
      player_name?: string | null;
    };
    QuestCompleteRequest: {
      quest_id: "joy_first_recipe";
    };
    QuestProgressRequest: {
      quest_id: "joy_first_recipe";
    };
    QuestStartRequest: {
      quest_id: "joy_first_recipe";
    };
    QuestStateResponse: {
      can_complete: boolean;
      collected_ingredients: Array<string>;
      crafted: boolean;
      description: string;
      quest_id: string;
      recipe_id: string;
      required_ingredients: Array<string>;
      status: "not_started" | "active" | "completed";
      title: string;
    };
    QuestsResponse: {
      items: Array<components["schemas"]["QuestStateResponse"]>;
    };
    RecipeCraftRequest: {
      recipe_id: "golden_vanilla_bloom";
    };
    RecipeStateResponse: {
      ability: string;
      can_craft: boolean;
      crafted: boolean;
      emotion: string;
      lore: string;
      name: string;
      recipe_id: string;
      required_ingredients: Array<string>;
    };
    RecipesResponse: {
      items: Array<components["schemas"]["RecipeStateResponse"]>;
    };
    RefreshRequest: {
      refresh_token: string;
    };
    RefreshResponse: {
      access_token: string;
      expires_at: string;
      refresh_token: string;
      token_type?: "bearer";
    };
    RegisterRequest: {
      display_name: string;
      email: string;
      password: string;
    };
    SaveStatusResponse: {
      last_event: string | null;
      last_saved_at: string | null;
      status: "not_saved" | "saved";
    };
    ValidationError: {
      loc: Array<string | number>;
      msg: string;
      type: string;
    };
    WeatherResponse: {
      items: Array<components["schemas"]["WeatherStateResponse"]>;
    };
    WeatherStateResponse: {
      condition: "sunny" | "rain" | "fog" | "snow" | "magical";
      details?: Record<string, unknown>;
      id: string;
      intensity: number;
      island_id: string;
      island_key: string;
    };
    WorldEventResponse: {
      event_type: string;
      id: string;
      island_key: string | null;
      occurred_at: string;
      payload?: Record<string, unknown>;
    };
    WorldEventsResponse: {
      items: Array<components["schemas"]["WorldEventResponse"]>;
    };
    WorldMapPosition: {
      x: number;
      y: number;
    };
    WorldResponse: {
      events: Array<components["schemas"]["WorldEventResponse"]>;
      islands: Array<components["schemas"]["IslandSummary"]>;
      weather: Array<components["schemas"]["WeatherStateResponse"]>;
    };
  };
};

export type paths = {
  "/api/ai/companion/respond": {
    post: {
      operationId: "ai_companion_respond";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["AICompanionRespondRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["AICompanionRespondResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "404": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/ai/journal/story": {
    post: {
      operationId: "ai_journal_story";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["AIJournalStoryRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["AIJournalStoryResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "404": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/ai/npc/chat": {
    post: {
      operationId: "ai_npc_chat";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["AINpcChatRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["AINpcChatResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "404": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/ai/recipe/describe": {
    post: {
      operationId: "ai_recipe_describe";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["AIRecipeDescribeRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["AIRecipeDescribeResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "404": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/auth/guest": {
    post: {
      operationId: "auth_guest";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["GuestLoginRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["AuthSessionResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/auth/login": {
    post: {
      operationId: "auth_login";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["LoginRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["AuthSessionResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/auth/logout": {
    post: {
      operationId: "auth_logout";
      requestBody: {
        required: false;
        content: {
          "application/json"?: components["schemas"]["LogoutRequest"] | null;
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["LogoutResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/auth/me": {
    get: {
      operationId: "auth_me";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["MeResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/auth/refresh": {
    post: {
      operationId: "auth_refresh";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["RefreshRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["RefreshResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/auth/register": {
    post: {
      operationId: "auth_register";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["RegisterRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["AuthSessionResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/game/start": {
    post: {
      operationId: "start_game";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["GameStartRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["GameStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/game/state": {
    get: {
      operationId: "get_game_state";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["GameStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/inventory": {
    get: {
      operationId: "get_inventory";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["InventoryResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/inventory/collect": {
    post: {
      operationId: "collect_inventory_ingredient";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["InventoryCollectRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["GameStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/journal": {
    get: {
      operationId: "get_journal";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["JournalResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/journal/create": {
    post: {
      operationId: "create_journal_entry";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["JournalCreateRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["GameStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/npcs": {
    get: {
      operationId: "list_npcs";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["NpcsResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "404": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/npcs/{npc_id}": {
    get: {
      operationId: "get_npc";
      parameters: {
        path: {
          npc_id: string;
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["NpcStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "404": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/npcs/{npc_id}/gift": {
    post: {
      operationId: "give_npc_gift";
      parameters: {
        path: {
          npc_id: string;
        };
      };
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["NpcGiftRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["NpcGiftResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "404": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/quests": {
    get: {
      operationId: "get_quests";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["QuestsResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/quests/complete": {
    post: {
      operationId: "complete_quest";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["QuestCompleteRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["GameStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/quests/progress": {
    post: {
      operationId: "update_quest_progress";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["QuestProgressRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["GameStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/quests/start": {
    post: {
      operationId: "start_quest";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["QuestStartRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["GameStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/recipes": {
    get: {
      operationId: "get_recipes";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["RecipesResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/recipes/craft": {
    post: {
      operationId: "craft_recipe";
      requestBody: {
        required: true;
        content: {
          "application/json": components["schemas"]["RecipeCraftRequest"];
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["GameStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/world": {
    get: {
      operationId: "get_world";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["WorldResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/world/events": {
    get: {
      operationId: "get_world_events";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["WorldEventsResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/world/islands": {
    get: {
      operationId: "list_world_islands";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["IslandsResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/api/world/islands/{island_id}": {
    get: {
      operationId: "get_world_island";
      parameters: {
        path: {
          island_id: string;
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["IslandSummary"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "404": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["HTTPValidationError"];
          };
        };
      };
    };
  };
  "/api/world/islands/{island_id}/restore": {
    post: {
      operationId: "restore_world_island";
      parameters: {
        path: {
          island_id: string;
        };
      };
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["GameStateResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "403": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "409": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
        "422": {
          content: {
            "application/json": components["schemas"]["HTTPValidationError"];
          };
        };
      };
    };
  };
  "/api/world/weather": {
    get: {
      operationId: "get_world_weather";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["WeatherResponse"];
          };
        };
        "401": {
          content: {
            "application/json": components["schemas"]["ErrorResponse"];
          };
        };
      };
    };
  };
  "/health": {
    get: {
      operationId: "get_health";
      responses: {
        "200": {
          content: {
            "application/json": components["schemas"]["HealthResponse"];
          };
        };
      };
    };
  };
};

export type ApiErrorEnvelope = components["schemas"]["ErrorResponse"];
export type HealthResponse = components["schemas"]["HealthResponse"];
export type AccessTokenProvider = () => string | null;
export type AccessTokenRefreshHandler = () => Promise<string | null>;

export class GeneratedApiClient {
  constructor(
    private readonly baseUrl = "http://localhost:8000",
    private readonly accessTokenProvider?: AccessTokenProvider,
    private readonly refreshAccessToken?: AccessTokenRefreshHandler,
  ) {}

  async aiCompanionRespond(
    body: components["schemas"]["AICompanionRespondRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["AICompanionRespondResponse"]> {
    return this.request<components["schemas"]["AICompanionRespondResponse"]>(
      "/api/ai/companion/respond",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async aiJournalStory(
    body: components["schemas"]["AIJournalStoryRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["AIJournalStoryResponse"]> {
    return this.request<components["schemas"]["AIJournalStoryResponse"]>(
      "/api/ai/journal/story",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async aiNpcChat(
    body: components["schemas"]["AINpcChatRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["AINpcChatResponse"]> {
    return this.request<components["schemas"]["AINpcChatResponse"]>(
      "/api/ai/npc/chat",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async aiRecipeDescribe(
    body: components["schemas"]["AIRecipeDescribeRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["AIRecipeDescribeResponse"]> {
    return this.request<components["schemas"]["AIRecipeDescribeResponse"]>(
      "/api/ai/recipe/describe",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async authGuest(
    body: components["schemas"]["GuestLoginRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["AuthSessionResponse"]> {
    return this.request<components["schemas"]["AuthSessionResponse"]>(
      "/api/auth/guest",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async authLogin(
    body: components["schemas"]["LoginRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["AuthSessionResponse"]> {
    return this.request<components["schemas"]["AuthSessionResponse"]>(
      "/api/auth/login",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async authLogout(
    body: components["schemas"]["LogoutRequest"] | null = null,
    options: RequestInit = {},
  ): Promise<components["schemas"]["LogoutResponse"]> {
    return this.request<components["schemas"]["LogoutResponse"]>(
      "/api/auth/logout",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async authMe(
    options: RequestInit = {},
  ): Promise<components["schemas"]["MeResponse"]> {
    return this.request<components["schemas"]["MeResponse"]>("/api/auth/me", {
      ...options,
      method: "GET",
    });
  }

  async authRefresh(
    body: components["schemas"]["RefreshRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["RefreshResponse"]> {
    return this.request<components["schemas"]["RefreshResponse"]>(
      "/api/auth/refresh",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async authRegister(
    body: components["schemas"]["RegisterRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["AuthSessionResponse"]> {
    return this.request<components["schemas"]["AuthSessionResponse"]>(
      "/api/auth/register",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async startGame(
    body: components["schemas"]["GameStartRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["GameStateResponse"]> {
    return this.request<components["schemas"]["GameStateResponse"]>(
      "/api/game/start",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async getGameState(
    options: RequestInit = {},
  ): Promise<components["schemas"]["GameStateResponse"]> {
    return this.request<components["schemas"]["GameStateResponse"]>(
      "/api/game/state",
      { ...options, method: "GET" },
    );
  }

  async getInventory(
    options: RequestInit = {},
  ): Promise<components["schemas"]["InventoryResponse"]> {
    return this.request<components["schemas"]["InventoryResponse"]>(
      "/api/inventory",
      { ...options, method: "GET" },
    );
  }

  async collectInventoryIngredient(
    body: components["schemas"]["InventoryCollectRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["GameStateResponse"]> {
    return this.request<components["schemas"]["GameStateResponse"]>(
      "/api/inventory/collect",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async getJournal(
    options: RequestInit = {},
  ): Promise<components["schemas"]["JournalResponse"]> {
    return this.request<components["schemas"]["JournalResponse"]>(
      "/api/journal",
      { ...options, method: "GET" },
    );
  }

  async createJournalEntry(
    body: components["schemas"]["JournalCreateRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["GameStateResponse"]> {
    return this.request<components["schemas"]["GameStateResponse"]>(
      "/api/journal/create",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async listNpcs(
    options: RequestInit = {},
  ): Promise<components["schemas"]["NpcsResponse"]> {
    return this.request<components["schemas"]["NpcsResponse"]>("/api/npcs", {
      ...options,
      method: "GET",
    });
  }

  async getNpc(
    npcId: string,
    options: RequestInit = {},
  ): Promise<components["schemas"]["NpcStateResponse"]> {
    return this.request<components["schemas"]["NpcStateResponse"]>(
      "/api/npcs/{npc_id}".replace(
        "{npc_id}",
        encodeURIComponent(String(npcId)),
      ),
      { ...options, method: "GET" },
    );
  }

  async giveNpcGift(
    npcId: string,
    body: components["schemas"]["NpcGiftRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["NpcGiftResponse"]> {
    return this.request<components["schemas"]["NpcGiftResponse"]>(
      "/api/npcs/{npc_id}/gift".replace(
        "{npc_id}",
        encodeURIComponent(String(npcId)),
      ),
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async getQuests(
    options: RequestInit = {},
  ): Promise<components["schemas"]["QuestsResponse"]> {
    return this.request<components["schemas"]["QuestsResponse"]>(
      "/api/quests",
      { ...options, method: "GET" },
    );
  }

  async completeQuest(
    body: components["schemas"]["QuestCompleteRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["GameStateResponse"]> {
    return this.request<components["schemas"]["GameStateResponse"]>(
      "/api/quests/complete",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async updateQuestProgress(
    body: components["schemas"]["QuestProgressRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["GameStateResponse"]> {
    return this.request<components["schemas"]["GameStateResponse"]>(
      "/api/quests/progress",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async startQuest(
    body: components["schemas"]["QuestStartRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["GameStateResponse"]> {
    return this.request<components["schemas"]["GameStateResponse"]>(
      "/api/quests/start",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async getRecipes(
    options: RequestInit = {},
  ): Promise<components["schemas"]["RecipesResponse"]> {
    return this.request<components["schemas"]["RecipesResponse"]>(
      "/api/recipes",
      { ...options, method: "GET" },
    );
  }

  async craftRecipe(
    body: components["schemas"]["RecipeCraftRequest"],
    options: RequestInit = {},
  ): Promise<components["schemas"]["GameStateResponse"]> {
    return this.request<components["schemas"]["GameStateResponse"]>(
      "/api/recipes/craft",
      {
        ...options,
        method: "POST",
        body: body === null ? undefined : JSON.stringify(body),
      },
    );
  }

  async getWorld(
    options: RequestInit = {},
  ): Promise<components["schemas"]["WorldResponse"]> {
    return this.request<components["schemas"]["WorldResponse"]>("/api/world", {
      ...options,
      method: "GET",
    });
  }

  async getWorldEvents(
    options: RequestInit = {},
  ): Promise<components["schemas"]["WorldEventsResponse"]> {
    return this.request<components["schemas"]["WorldEventsResponse"]>(
      "/api/world/events",
      { ...options, method: "GET" },
    );
  }

  async listWorldIslands(
    options: RequestInit = {},
  ): Promise<components["schemas"]["IslandsResponse"]> {
    return this.request<components["schemas"]["IslandsResponse"]>(
      "/api/world/islands",
      { ...options, method: "GET" },
    );
  }

  async getWorldIsland(
    islandId: string,
    options: RequestInit = {},
  ): Promise<components["schemas"]["IslandSummary"]> {
    return this.request<components["schemas"]["IslandSummary"]>(
      "/api/world/islands/{island_id}".replace(
        "{island_id}",
        encodeURIComponent(String(islandId)),
      ),
      { ...options, method: "GET" },
    );
  }

  async restoreWorldIsland(
    islandId: string,
    options: RequestInit = {},
  ): Promise<components["schemas"]["GameStateResponse"]> {
    return this.request<components["schemas"]["GameStateResponse"]>(
      "/api/world/islands/{island_id}/restore".replace(
        "{island_id}",
        encodeURIComponent(String(islandId)),
      ),
      { ...options, method: "POST" },
    );
  }

  async getWorldWeather(
    options: RequestInit = {},
  ): Promise<components["schemas"]["WeatherResponse"]> {
    return this.request<components["schemas"]["WeatherResponse"]>(
      "/api/world/weather",
      { ...options, method: "GET" },
    );
  }

  async getHealth(
    options: RequestInit = {},
  ): Promise<components["schemas"]["HealthResponse"]> {
    return this.request<components["schemas"]["HealthResponse"]>("/health", {
      ...options,
      method: "GET",
    });
  }

  private async request<TResponse>(
    path: string,
    init: RequestInit,
  ): Promise<TResponse> {
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    if (init.body) {
      headers.set("Content-Type", "application/json");
    }

    const accessToken = this.accessTokenProvider?.();
    if (accessToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    let response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (
      response.status === 401 &&
      accessToken &&
      this.refreshAccessToken &&
      path !== "/api/auth/guest" &&
      path !== "/api/auth/login" &&
      path !== "/api/auth/refresh" &&
      path !== "/api/auth/register"
    ) {
      const refreshedAccessToken = await this.refreshAccessToken().catch(
        () => null,
      );
      if (refreshedAccessToken) {
        headers.set("Authorization", `Bearer ${refreshedAccessToken}`);
        response = await fetch(`${this.baseUrl}${path}`, {
          ...init,
          headers,
        });
      }
    }

    if (!response.ok) {
      const payload = (await response
        .json()
        .catch(() => null)) as ApiErrorEnvelope | null;
      throw new Error(payload?.error.message ?? "Request failed");
    }

    return (await response.json()) as TResponse;
  }
}
