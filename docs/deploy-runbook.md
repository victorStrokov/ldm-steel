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

## 5. Database Migration Procedure

Run migrations before switching traffic to a new application version.

Option A (inside temporary app container):

```bash
docker compose run --rm app npx prisma migrate deploy
```

Option B (CI/CD migration job):

- Execute prisma migrate deploy with production DATABASE_URL
- Proceed to deployment only when migration succeeds

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

## 7. Backup and Safety Checklist

Before deploy:

- Confirm latest DB backup exists
- Confirm required env vars are present
- Confirm image digest/tag to deploy

After deploy:

- Verify app starts and responds
- Verify auth and checkout basic flow
- Monitor logs for errors for at least 10-15 minutes

## 8. Incident Notes Template

- Deployment time:
- Image tag/digest:
- Migration applied:
- Detected issue:
- Mitigation/rollback action:
- Final status:
