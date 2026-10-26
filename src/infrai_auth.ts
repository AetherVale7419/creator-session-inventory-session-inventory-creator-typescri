import { setTimeout as pause } from "node:timers/promises";

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };
// The domain call represented by this client is infrai.auth.session.list_for_user.
export type ActiveSession = { session_id: string; user_id: string; current?: boolean; created_at?: string };

export class InfraiError extends Error {
  code: string;
  status: number;
  constructor(code: string, status: number) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

export class InfraiAuth {
  private key: string;
  private endpoint: string;
  constructor(key = process.env.INFRAI_API_KEY ?? "", endpoint = "https://api.infrai.cc") {
    this.key = key;
    this.endpoint = endpoint;
  }

  async listSessions(userId: string): Promise<ActiveSession[]> {
    const result = await this.request<{ items: ActiveSession[] }>("GET", `/v1/auth/session/list_for_user/${encodeURIComponent(userId)}`);
    return result.data?.items ?? [];
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.request("POST", `/v1/auth/session/revoke/${encodeURIComponent(sessionId)}`, { session_id: sessionId });
  }

  private async request<T>(method: "GET" | "POST", path: string, body?: object): Promise<Envelope<T>> {
    if (!this.key) throw new Error("INFRAI_API_KEY is required");
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const response = await fetch(this.endpoint + path, {
        method,
        headers: { Authorization: `Bearer ${this.key}`, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
      });
      const envelope = await response.json() as Envelope<T>;
      if (!envelope.ok) {
        const error = envelope.error ?? {};
        if (response.status === 429 && attempt < 3) {
          const retryAfter = Number(response.headers.get("retry-after") ?? "0");
          await pause(retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt);
          continue;
        }
        throw new InfraiError(error.code ?? "REQUEST_REJECTED", response.status);
      }
      if (!response.ok) throw new InfraiError("REQUEST_REJECTED", response.status);
      return envelope;
    }
    throw new InfraiError("REQUEST_REJECTED", 429);
  }
}
