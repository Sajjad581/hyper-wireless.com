# Going live on hyper-wireless.com (Cloudflare Workers)

This app is a **server-rendered React app (TanStack Start)**, so it needs a host that
runs the server bundle. Cloudflare Workers is already configured for it.

Your IDs are already in `wrangler.toml`:

- Account ID: `8abab5aa5da77f73d3f66cd4e2f5432d`
- Zone ID: `5e684f2fecf1ba024d7fc3e361ca51e6`

## Step 1 — Create an API token

Cloudflare dashboard → **My Profile → API Tokens → Create Token** →
template **Edit Cloudflare Workers**. Under scope pick:

- Account: your account (`8abab...`)
- Zone: `hyper-wireless.com`

Copy the token once — it is never shown again.

## Step 2 — Add DNS records for the domain

Cloudflare → `hyper-wireless.com` → **DNS → Records**. A Worker route needs a DNS
record to attach to, so add these two **proxied (orange cloud)** records:

| Type | Name  | Content   | Proxy |
| ---- | ----- | --------- | ----- |
| A    | `@`   | `192.0.2.1` | Proxied |
| A    | `www` | `192.0.2.1` | Proxied |

(`192.0.2.1` is the reserved placeholder IP — traffic never reaches it, the Worker
answers first.)

Then **SSL/TLS → Overview → Full (strict)**.

## Step 3 — Deploy

### Option A: from GitHub (automatic on every push)

In the repo → **Settings → Secrets and variables → Actions → New repository secret**:

- `CLOUDFLARE_API_TOKEN` = token from step 1
- `CLOUDFLARE_ACCOUNT_ID` = `8abab5aa5da77f73d3f66cd4e2f5432d`

Push to `main`. `.github/workflows/deploy.yml` builds and deploys the Worker.

### Option B: from your machine (one-off)

```bash
bun install
bun run build
export CLOUDFLARE_API_TOKEN=<token from step 1>
bunx wrangler deploy
```

## Step 4 — Verify

```bash
curl -I https://hyper-wireless.com
```

Expect `HTTP/2 200` plus a `cf-ray` header. Routes are already declared in
`wrangler.toml`, so no manual route setup is needed in the dashboard; you can
confirm them under **Workers & Pages → hyper-wireless → Settings → Domains & Routes**.

## Local run

```bash
bun install
bun dev        # http://localhost:8080
bun run build  # production build in dist/
```

## Notes

- Node 20+ or Bun 1.1+ required.
- Never commit the API token — keep it in GitHub Secrets or your shell env.
- Do not commit `dist/`, `node_modules/`, or `.env`.
- Zone/Account IDs are not secrets; the API token is.
