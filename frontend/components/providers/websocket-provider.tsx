"use client";

import { ReactNode, createContext, useContext } from "react";

import { gameWebSocketClient } from "@/lib/websocket/websocket-client";

const WebSocketContext = createContext(gameWebSocketClient);

type WebSocketProviderProps = {
  children: ReactNode;
};

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  return (
    <WebSocketContext.Provider value={gameWebSocketClient}>{children}</WebSocketContext.Provider>
  );
}

export function useGameWebSocket() {
  return useContext(WebSocketContext);
}
