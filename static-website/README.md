# AEON Cloud Static Website

This folder contains a simple, fast, SEO-friendly static HTML version of the AEON Cloud landing page. It is designed to be uploaded to a GitHub repository and published via GitHub Pages (or Cloudflare Pages / any static host).

## Files

- `index.html` — Main landing page with the AeonTest login button
- `style.css` — Stylesheet (dark engineering theme, mobile responsive)

## Key link

All "Login to AeonTest" buttons point to:

```
https://aeontest.hyper-wireless.com
```

## How to upload to GitHub

### Option A: Create a new repository

1. Go to [GitHub.com](https://github.com) and log in.
2. Click **+** in the top right → **New repository**.
3. Name it `hyper-wireless-website` (or any name you like).
4. Choose **Public**.
5. Click **Create repository**.
6. On the next page, click **uploading an existing file**.
7. Drag and drop `index.html` and `style.css` from this folder.
8. Scroll down and click **Commit changes**.

### Option B: Add to your existing repo

If you already have `https://github.com/Sajjad581/hyper-wireless.com`, you can add these files into a `static-website/` folder and then configure GitHub Pages to serve from that folder.

## How to make it live with GitHub Pages

1. In your GitHub repository, click **Settings**.
2. In the left sidebar, click **Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Under **Branch**, select `main` and folder `/ (root)` (or `/static-website` if you put it in a subfolder).
5. Click **Save**.
6. GitHub will give you a URL like `https://yourusername.github.io/hyper-wireless-website`.

## Custom domain (hyper-wireless.com)

1. In the same GitHub Pages settings, under **Custom domain**, enter `hyper-wireless.com`.
2. Add a `CNAME` file in the repository root containing:
   ```
   hyper-wireless.com
   ```
3. In Cloudflare DNS, add:
   - CNAME `www` → `yourusername.github.io`
   - Or A records for apex: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Enable HTTPS in GitHub Pages settings.

## Note about the existing React app

Your current project also has a full React/TanStack Start app configured for Cloudflare Workers deployment. That is the premium version. This static HTML version is a simpler, faster landing page that links to your AeonTest dashboard. You can use one or both.
