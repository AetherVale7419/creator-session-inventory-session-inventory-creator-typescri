import assert from "node:assert/strict";
import { signOutOtherSessions } from "./session_service.ts";

const listed = [
  { session_id: "current", user_id: "creator-1" },
  { session_id: "laptop", user_id: "creator-1" },
  { session_id: "phone", user_id: "creator-1" }
];
const revoked: string[] = [];
const auth = {
  async listSessions() { return listed; },
  async revokeSession(sessionId: string) { revoked.push(sessionId); }
} as any;

const result = await signOutOtherSessions({ user_id: "creator-1", current_session_id: "current" }, auth);
assert.deepEqual(result.revoked_session_ids, ["laptop", "phone"]);
assert.deepEqual(revoked, ["laptop", "phone"]);
console.log("session decision test passed");
