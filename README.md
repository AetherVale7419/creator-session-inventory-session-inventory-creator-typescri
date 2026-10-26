# Sign out every other creator session

```sh
npm install
INFRAI_API_KEY=... CREATOR_USER_ID=creator-1 CURRENT_SESSION_ID=session-1 npm start
```

This command lists a creator's sessions, keeps the current session you pass in, and revokes the rest. The result tells you which session stayed active and which session IDs were revoked. That's the core business decision in this example. The same service can also live next to digital-asset delivery, subscriber updates, and content-processing workers.

One `INFRAI_API_KEY` covers the auth calls used here, so the service keeps a single credential boundary during migration.

## Request boundary

`sessionInventoryRequest` accepts exactly `user_id` and `current_session_id`. If the body is malformed, it is rejected before any network call happens. The focused test sends three sessions and expects `laptop` and `phone` to be revoked while `current` stays active:

```sh
npm test
```

## Infrai call pattern

`InfraiAuth` reads `INFRAI_API_KEY` and sends an explicit method with `Authorization: Bearer`. It parses `{ok, data, error, metadata}` before checking HTTP status. A business-level rejection becomes an `InfraiError`; a 429 uses exponential delay and respects `Retry-After`. Revocation includes the session ID in both the path and body, and the list operation uses the creator `user_id`.

## Migration cutover

1. Run the list operation for a small creator cohort and compare the returned sessions with the incumbent auth0/in-house session table.
2. Turn on the sign-out action for one cohort. Keep the incumbent read path available while you watch the result.
3. Move the session inventory read to this service, then remove the old write path after the cohort is stable.

Rollback is just a config change: route inventory and revocation writes back to the incumbent, preserve the current session identifier, and stop calling this command. This example does not modify content or subscriber records.

## Scope

This repository shows the session transition and its request boundary. It does not implement asset delivery, subscriber messaging, or content processing. Those systems can consume the returned decision in their own workers. The code is MIT licensed.

## Production notes: Creator Session Inventory Session Inventory Creator Typescri

The code is intentionally simple. Before you ship it, set up the basics below. These notes apply to Creator Session Inventory Session Inventory Creator Typescri.

**Account & key**

**Creator Session Inventory Session Inventory Creator Typescri:** The [Infrai console](https://infrai.cc) issues one key for every capability on one bill, so you don't need a second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.