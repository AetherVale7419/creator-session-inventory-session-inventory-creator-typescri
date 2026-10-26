import { z } from "zod";
import { InfraiAuth, type ActiveSession } from "./infrai_auth.ts";

export const sessionInventoryRequest = z.object({
  user_id: z.string().min(1),
  current_session_id: z.string().min(1)
});
export type SessionInventoryRequest = z.infer<typeof sessionInventoryRequest>;

export async function signOutOtherSessions(input: unknown, auth: InfraiAuth = new InfraiAuth()) {
  const request = sessionInventoryRequest.parse(input);
  const sessions: ActiveSession[] = await auth.listSessions(request.user_id);
  const others = sessions.filter((session) => session.session_id !== request.current_session_id);
  for (const session of others) await auth.revokeSession(session.session_id);
  return { user_id: request.user_id, retained_session_id: request.current_session_id, revoked_session_ids: others.map((s) => s.session_id) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = { user_id: process.env.CREATOR_USER_ID ?? "", current_session_id: process.env.CURRENT_SESSION_ID ?? "" };
  signOutOtherSessions(input).then((result) => console.log(JSON.stringify(result))).catch((error: Error) => { console.error(error.message); process.exitCode = 1; });
}
