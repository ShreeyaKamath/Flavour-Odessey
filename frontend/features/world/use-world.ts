"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api/client";

export const worldQueryKey = ["world"] as const;

export function useWorld() {
  return useQuery({
    queryFn: () => apiClient.getWorld(),
    queryKey: worldQueryKey
  });
}
