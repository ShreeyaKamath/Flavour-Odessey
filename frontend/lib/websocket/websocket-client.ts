export type WebSocketStatus = "idle" | "connecting" | "connected" | "closed" | "error";

/** Owns the shared browser WebSocket connection lifecycle. */
export class GameWebSocketClient {
  status: WebSocketStatus = "idle";

  connect() {
    this.status = "connecting";
  }

  close() {
    this.status = "closed";
  }
}

export const gameWebSocketClient = new GameWebSocketClient();
