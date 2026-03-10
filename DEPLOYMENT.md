# Gambot Website — Next.js Deployment Guide

## 🏗️ Architecture

- **Public website** (this project): `gambot.co.il` → Next.js on Vercel
- **Internal app**: `app.gambot.co.il` → React SPA on Firebase Hosting

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Push to GitHub
```bash
cd gmbt_website
git init
git add .
git commit -m "Initial Next.js SEO website"
git remote add origin https://github.com/YOUR_ORG/gmbt_website.git
git push -u origin main
```

### Step 2: Connect Vercel
1. Go to https://vercel.com/new
2. Import the `gmbt_website` repo
3. Vercel auto-detects Next.js — click Deploy

### Step 3: Configure Domain
1. In Vercel → Project Settings → Domains
2. Add `gambot.co.il` and `www.gambot.co.il`
3. In your DNS provider, update A/CNAME records:
   - `@` → `76.76.21.21` (Vercel IP)
   - `www` → `cname.vercel-dns.com`

### Step 4: Move Internal App
1. Deploy existing React app to `app.gambot.co.il` (Firebase Hosting with custom domain)
2. Update login/CTA links in `next.config.mjs` rewrites to point to `app.gambot.co.il`

## 📁 File Structure
```
gmbt_website/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout with metadata
│   │   ├── page.js            # Homepage (/)
│   │   ├── sitemap.js         # Dynamic sitemap
│   │   ├── robots.js          # robots.txt
│   │   ├── not-found.js       # 404 page
│   │   ├── בוט-וואטסאפ/      # Hebrew SEO pages
│   │   ├── Blog/              # Blog index
│   │   └── blog/[id]/[slug]/  # Blog posts (SSG)
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── LeadForm/
│   │   ├── Blog/
│   │   ├── Contact/
│   │   ├── Pricing/
│   │   └── shared/LandingPageContent.js
│   └── lib/
│       ├── pageMeta.js        # Centralized SEO metadata
│       └── blogPosts.js       # Blog posts data
└── public/
    ├── og-image.jpg           # Open Graph image (1200x630)
    └── blog/                  # Blog post images
```

## ✅ Post-Deployment Checklist
- [ ] Verify all pages load at gambot.co.il
- [ ] Check Google Search Console — submit new sitemap
- [ ] Verify structured data with Google Rich Results Test
- [ ] Check mobile responsiveness
- [ ] Update internal app links to app.gambot.co.il
- [ ] Add OG image at /public/og-image.jpg
- [ ] Add blog images at /public/blog/post1.jpg etc.

## 🔍 SEO What Changed
- Every page now has **unique title**, **unique description**, **canonical URL**
- All pages are **SSG** (pre-rendered HTML) — Google can index immediately
- **sitemap.xml** auto-generated with all 52+ pages
- **JSON-LD structured data** on homepage, blog, landing pages
- **hreflang** tags for Hebrew/English variants
- **robots.txt** properly configured
