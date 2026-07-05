export const authSessionExpiredEvent = "flavor-odyssey:auth-session-expired";
export const authIdentityChangedEvent = "flavor-odyssey:auth-identity-changed";

export function notifyAuthIdentityChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(authIdentityChangedEvent));
  }
}
