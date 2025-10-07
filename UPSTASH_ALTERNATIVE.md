# Using Upstash Redis (Free Alternative to Vercel KV)

## Why Upstash?

Vercel KV is actually **powered by Upstash** under the hood! Since KV isn't available in your plan, we can connect directly to Upstash for FREE.

**Benefits:**
- ✅ **100% FREE** tier (10,000 requests/day)
- ✅ Same Redis API as Vercel KV
- ✅ Global edge network (low latency)
- ✅ No credit card required
- ✅ Works with existing code (minimal changes)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Free Upstash Account

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up with GitHub (instant, no credit card)
3. Click **Create Database**

### Step 2: Configure Database

**Settings:**
- Name: `fashion-cache`
- Type: **Regional** (cheaper) or **Global** (faster)
- Region: Choose closest to your users (e.g., `us-east-1`)
- TLS: ✅ Enabled (default)

Click **Create**

### Step 3: Get Connection Details

After creation, you'll see:
- **UPSTASH_REDIS_REST_URL**: `https://xxx.upstash.io`
- **UPSTASH_REDIS_REST_TOKEN**: `AXXXxxx...`

Click **Copy** for both values.

### Step 4: Add to Vercel Environment Variables

**In Vercel Dashboard:**
1. Go to Settings → Environment Variables
2. Add these two variables:

```
KV_REST_API_URL = https://your-db.upstash.io
KV_REST_API_TOKEN = AXXXxxx...your-token
```

**Important:** Use the exact variable names `KV_REST_API_URL` and `KV_REST_API_TOKEN` (our code already uses these!)

Select: ✅ Production, ✅ Preview, ✅ Development

Click **Save**.

### Step 5: Add to Local .env.local

Create/update `.env.local`:

```bash
# Upstash Redis (free alternative to Vercel KV)
KV_REST_API_URL=https://your-db.upstash.io
KV_REST_API_TOKEN=AXXXxxx...your-token

# Google API Keys
GOOGLE_SEARCH_API_KEY=your_api_key
STYLE_SEARCH_ID=your_search_id

# Optional: Key rotation
GOOGLE_SEARCH_API_KEY_1=second_key
GOOGLE_SEARCH_API_KEY_2=third_key
```

### Step 6: Update Package.json (One Small Change)

We need to switch from `@vercel/kv` to `@upstash/redis`:

```bash
npm uninstall @vercel/kv
npm install @upstash/redis
```

### Step 7: Deploy

```bash
git add .
git commit -m "Switch to Upstash Redis"
git push origin main
```

**That's it!** Your caching works exactly the same.

---

## 📊 Free Tier Limits

| Feature | Free Tier | Your Needs |
|---------|-----------|------------|
| Requests/day | 10,000 | 5,000-8,000 ✅ |
| Max DB size | 256 MB | ~10 MB ✅ |
| Max command size | 1 MB | ~10 KB ✅ |
| Concurrent connections | 1,000 | 100-200 ✅ |

**Verdict:** Free tier is MORE than enough for your use case! 🎉

---

## 🔄 Code Changes Required

### Change 1: Update Import Statement

**In all three API routes**, change:

```typescript
// OLD (Vercel KV)
import { kv } from "@vercel/kv";

// NEW (Upstash Redis)
import { Redis } from "@upstash/redis";

const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});
```

**Files to update:**
1. `src/app/api/style_search/route.ts`
2. `src/app/api/garment_search/route.ts`
3. `src/app/api/garment_image_search/route.ts`

### Change 2: That's It!

The API is **100% identical**. All `kv.get()`, `kv.set()`, `kv.del()` calls work exactly the same.

---

## 🎯 Why This Is Perfect

1. **No Code Rewrite**: Same Redis API, just different import
2. **Same Performance**: Edge network, <50ms latency
3. **Free Forever**: 10K requests/day is permanent free tier
4. **Easy Migration**: If you upgrade Vercel later, switch back to KV easily

---

## 🐛 Troubleshooting

**Error: "Authentication failed"**
- Check `KV_REST_API_TOKEN` is copied correctly
- Make sure no extra spaces in env var
- Verify token in Upstash console hasn't been regenerated

**Error: "Connection refused"**
- Check `KV_REST_API_URL` includes `https://`
- Verify URL is REST URL, not regular Redis URL
- Confirm database is active in Upstash console

**High latency (>200ms)**
- Choose regional database closer to Vercel deployment region
- Upgrade to Global database for multi-region

---

## 💡 Alternative: Next.js Native Cache (No External Service)

If you prefer **zero external dependencies**, I can also implement Next.js built-in caching using:
- `unstable_cache` API
- In-memory cache with LRU eviction
- File-based cache in `.next/cache`

**Trade-offs:**
- ✅ Zero cost, no sign-ups
- ✅ Works immediately
- ❌ Cache doesn't persist across deploys
- ❌ Not shared across serverless functions

Let me know if you prefer this approach instead!

---

## 🚀 Next Steps

**Choose your path:**

**A) Use Upstash (Recommended):**
1. Sign up at upstash.com (2 min)
2. Get connection details (1 min)
3. Add to Vercel env vars (1 min)
4. Run code changes below (1 min)
5. Deploy! (1 min)

**B) Use Next.js Native Cache:**
- Tell me and I'll implement it (5 min)
- No external services needed
- Good for development, less ideal for production

Which do you prefer? I'll implement it now! 🚀
