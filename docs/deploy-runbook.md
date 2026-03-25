# Deploy Runbook

This runbook describes production deployment for ldm-steel using Docker.

## 1. Prerequisites

- Docker Engine 24+ and Docker Compose v2
- Access to production environment variables
- Access to PostgreSQL production database
- Access to container registry (GHCR)

## 2. Required Environment Variables

Set these variables in the deployment environment (do not commit to git):

- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- YOOKASSA_SHOP_ID
- YOOKASSA_SECRET_KEY
- YOOKASSA_CALLBACK_URL
- RESEND_API_KEY

Optional:

- NODE_ENV=production
- PORT=3000

## 3. Build and Publish Image (GitHub Actions)

Workflow: .github/workflows/docker-image.yml

Trigger options:

- Push to main (publishes latest + sha tags)
- Manual dispatch (optionally skip push)

Registry:

- ghcr.io/<owner>/<repo>

## 4. Deployment Steps

1. Pull latest image on target host:

```bash
docker pull ghcr.io/<owner>/ldm-steel:latest
```

2. Create runtime env file on host (example: .env.production):

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain
YOOKASSA_SHOP_ID=...
YOOKASSA_SECRET_KEY=...
YOOKASSA_CALLBACK_URL=https://your-domain/api/checkout/callback
RESEND_API_KEY=...
```

3. Start services:

```bash
docker compose up -d
```

4. Verify health:

```bash
docker compose ps
docker compose logs --tail=100 app
```

## 5. Database Migration Procedure (Shared DB Policy)

Shared database ownership is centralized in admin-panel.

- Do not run prisma migrate deploy from ldm-steel deploy pipeline.
- Apply schema/data migrations only via admin-panel workflow.
- After admin-panel migrations, execute ldm-steel smoke checks before opening traffic.

## 6. Rollback Procedure

1. Find previous stable image tag (usually a commit SHA tag in GHCR).
2. Update deployment to use previous tag.
3. Restart app service:

```bash
docker compose up -d app
```

4. Validate application and checkout flow.

Important:

- If a migration is backward-incompatible, use a pre-approved DB rollback strategy or hotfix migration.
- Avoid manual data changes without backup.

## 7. Backup and Safety Checklist (Owner: admin-panel)

Before deploy:

- Confirm latest DB backup exists
- Confirm restore procedure and rollback owner are assigned in admin-panel
- Confirm required env vars are present
- Confirm image digest/tag to deploy

After deploy:

- Verify app starts and responds
- Verify auth and checkout basic flow
- Monitor logs for errors for at least 10-15 minutes

## 8. Post-Restore Compatibility Smoke Check (Mandatory for ldm-steel)

Run this checklist after any DB restore, PITR operation, or restore-drill.

Preparation:

- Set BASE_URL for target environment (example: https://shop.example.com)
- Ensure at least one test user and one published product exist in restored data

Checks:

1. Health and DB connectivity

```bash
curl -fsS "$BASE_URL/api/health"
```

Pass criteria: HTTP 200 and healthy DB check.

2. Public catalog compatibility

```bash
curl -fsS "$BASE_URL/api/products/search?query=test"
curl -fsS "$BASE_URL/api/ingredients"
curl -fsS "$BASE_URL/api/stories"
```

Pass criteria: HTTP 200, valid JSON, no 5xx.

3. Auth/session compatibility (smoke)

```bash
curl -fsS "$BASE_URL/api/auth/me"
```

Pass criteria: endpoint responds correctly (authenticated or unauthorized) without server errors.

4. Checkout callback schema compatibility

Use sandbox callback payload in a controlled environment and verify order/payment status transition path does not fail with schema errors.

Pass criteria: no runtime/schema errors in app logs; expected status transition is persisted.

5. Cross-app consistency with admin-panel

- Product visible in ldm-steel after restore.
- New order created from ldm-steel is visible in admin-panel.

Pass criteria: data contract between apps is intact.

Failure policy:

- Any failed step blocks release.
- Open incident note and attach failing step, logs, and timestamp.
- Escalate to admin-panel DB owner for restore correction or follow-up migration.

## 9. Incident Notes Template

General incident fields:

- Deployment time:
- Image tag/digest:
- Migration applied:
- Detected issue:
- Mitigation/rollback action:
- Final status:

Restore/PITR incident fields (mandatory when restore was involved):

- Restore type: (full restore | PITR | drill)
- Restore source snapshot/time:
- PITR target timestamp (UTC):
- DB owner on duty (admin-panel):
- Smoke-check step failed:
- First failing endpoint/query:
- Error signature (message/class):
- Affected tenant/order/user IDs (if any):
- Log references (app + DB):
- Time to detect (TTD):
- Time to mitigate (TTM):
- Corrective action (restore fix or follow-up migration):
- Verification after fix (which smoke steps passed):
