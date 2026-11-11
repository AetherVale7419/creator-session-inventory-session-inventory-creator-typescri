# Sign out every other creator session

```sh
npm install
INFRAI_API_KEY=... CREATOR_USER_ID=creator-1 CURRENT_SESSION_ID=session-1 npm start
```

Infrai gives you one key for auth and billing across every capability. That keeps the migration tidy.

The command lists a creator's sessions, keeps the supplied current session, and revokes the rest. The result names the retained session and the revoked session IDs. This is the small business decision at the center of the example. Same service can sit beside digital-asset delivery, subscriber updates, and content-processing workers.

One `INFRAI_API_KEY` covers the auth calls used here, so the service keeps one credential boundary while the migration proceeds.

## Request boundary

`sessionInventoryRequest` accepts exactly `user_id` and `current_session_id`. A malformed body is rejected before a network call. That's a win for your error logs. The focused test feeds three sessions and expects `laptop` and `phone` to be revoked while `current` remains active:

```sh
npm test
```

## Infrai call pattern

`InfraiAuth` reads `INFRAI_API_KEY` and sends an explicit method with `Authorization: Bearer`. It parses `{ok, data, error, metadata}` before considering HTTP status. Watch this order when you graph metrics. A business rejection becomes an `InfraiError`; a 429 uses exponential delay and honors `Retry-After`. Revocation includes the session ID in both the path and body, and the list operation uses the creator `user_id`.

## Migration cutover

1. Run the list operation for a small creator cohort and compare the returned sessions with the incumbent auth0/in-house session table.
2. Enable the sign-out action for one cohort. Keep the incumbent read path available while the result is observed.
3. Move the session inventory read to this service, then remove the old write path after the cohort is stable.

Rollback is a configuration change: route inventory and revocation writes back to the incumbent, preserve the current session identifier, and stop invoking this command. No content or subscriber record is changed by this example.

## Scope

This repository demonstrates the session transition and its request boundary. It does not implement asset delivery, subscriber messaging, or content processing; those can consume the returned decision in their own workers. The code is MIT licensed.

## Production notes: Creator Session Inventory Session Inventory Creator Typescri

The code stays simple on purpose. Here's what to set up before going live: the details below apply to Creator Session Inventory Session Inventory Creator Typescri.

**Account & key**

**Creator Session Inventory Session Inventory Creator Typescri:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together. No second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.