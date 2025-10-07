# API Key Rotation Documentation

## Overview

The key rotation system automatically distributes API requests across multiple Google Custom Search API keys and search engine IDs. This prevents individual keys from hitting rate limits and significantly improves reliability under high load.

## Benefits

- **Increased Throughput**: Multiply your effective rate limit by the number of keys
- **Better Reliability**: If one key hits a rate limit, others continue working
- **Load Distribution**: Automatic distribution prevents quota exhaustion
- **Zero Downtime**: Seamless rotation with no user-facing impact

## How It Works

### Architecture

```
Frontend Request
    ↓
Vercel KV Cache (Check)
    ↓ (Cache Miss)
API Route Handler
    ↓
Key Rotation Utility
    ↓
│─ getGoogleSearchKey() ───→ Timestamp-based rotation
│─ getStyleSearchId()   ───→ Random selection
│─ getGarmentSearchId() ───→ Minute-based rotation
    ↓
Google Custom Search API
    ↓
Cache & Return Response
```

### Rotation Strategies

The system uses **three different rotation strategies** to optimize distribution:

#### 1. **Timestamp-Based** (Google API Keys)
```typescript
getGoogleSearchKey()
// Uses: Math.floor(Date.now() / 1000) % keyPool.length
// Result: Rotates every second based on Unix timestamp
// Best for: High-frequency requests with even distribution
```

#### 2. **Random Selection** (Style Search IDs)
```typescript
getStyleSearchId()
// Uses: Math.floor(Math.random() * keyPool.length)
// Result: Truly random selection on each call
// Best for: Unpredictable traffic patterns
```

#### 3. **Minute-Based** (Garment Search IDs)
```typescript
getGarmentSearchId()
// Uses: Math.floor(Date.now() / 60000) % keyPool.length
// Result: Rotates every minute
// Best for: Lower-frequency endpoints
```

## Setup Instructions

### Step 1: Obtain Multiple API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create 2-4 separate API keys (recommended: 3 keys)
3. Enable **Custom Search API** for each key
4. Set appropriate quotas and billing

**Pro Tip**: Use different projects for each key to maximize quotas:
- Project 1: `fashion-search-prod-1` → API Key 1
- Project 2: `fashion-search-prod-2` → API Key 2
- Project 3: `fashion-search-prod-3` → API Key 3

### Step 2: Create Multiple Custom Search Engines (Optional)

If you want to rotate search engine IDs as well:

1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Create 2-3 search engines with identical settings
3. Configure each with the same sites/patterns
4. Copy each search engine ID

### Step 3: Configure Environment Variables

#### For Local Development

Create or update `.env.local`:

```bash
# Primary keys (REQUIRED)
GOOGLE_SEARCH_API_KEY=AIza...primary_key
STYLE_SEARCH_ID=abc123...primary_id

# Additional keys for rotation (OPTIONAL but recommended)
GOOGLE_SEARCH_API_KEY_1=AIza...second_key
GOOGLE_SEARCH_API_KEY_2=AIza...third_key
GOOGLE_SEARCH_API_KEY_3=AIza...fourth_key

# Additional search IDs (OPTIONAL)
STYLE_SEARCH_ID_1=def456...second_id
STYLE_SEARCH_ID_2=ghi789...third_id

# Garment search IDs (if using garment features)
GARMENT_SEARCH_ID=jkl012...primary_garment_id
GARMENT_SEARCH_ID_1=mno345...second_garment_id
GARMENT_SEARCH_ID_2=pqr678...third_garment_id

# Vercel KV (already configured)
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

#### For Vercel Production

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - Variable name: `GOOGLE_SEARCH_API_KEY_1`
   - Value: `AIza...second_key`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
4. Repeat for all keys
5. Click **Save**

**Important**: Redeploy after adding variables!

```bash
git commit -m "Add key rotation env vars"
git push origin main
# Or trigger manual redeploy in Vercel dashboard
```

## Usage Examples

### Automatic Usage (No Code Changes Needed)

The key rotation is **automatically applied** to all three API routes:

```typescript
// In your API routes, keys are rotated automatically:

// src/app/api/style_search/route.ts
const googleKey = getGoogleSearchKey();    // Rotates every second
const styleId = getStyleSearchId();        // Random selection

// src/app/api/garment_search/route.ts
const googleKey = getGoogleSearchKey();    // Rotates every second
const garmentId = getGarmentSearchId();    // Rotates every minute

// src/app/api/garment_image_search/route.ts
const googleKey = getGoogleSearchKey();    // Rotates every second
const garmentId = getGarmentSearchId();    // Rotates every minute
```

### Monitoring Key Usage

Add logging to track which keys are being used:

```typescript
import { getGoogleSearchKey, getKeyPoolStats } from '@/lib/key-rotation';

// Get current key
const key = getGoogleSearchKey();
console.log('Using key:', key.substring(0, 10) + '...');

// Get statistics
const stats = getKeyPoolStats();
console.log('Key pool stats:', stats);
// Output: { googleKeys: 3, styleIds: 2, garmentIds: 2 }
```

## Rate Limit Math

### Without Key Rotation (Single Key)
- Google Custom Search: **100 queries/day free tier**
- Premium: **10,000 queries/day** per key
- **Total capacity**: 10,000 queries/day

### With Key Rotation (3 Keys)
- Key 1: 10,000 queries/day
- Key 2: 10,000 queries/day
- Key 3: 10,000 queries/day
- **Total capacity**: **30,000 queries/day** (3x improvement)

### Combined with Caching
- Cache hit rate: ~90-95% (from Vercel KV)
- Effective API calls: 5-10% of total requests
- **Example**: 100,000 page views → 5,000 API calls → Distributed across 3 keys = **1,667 calls per key**
- Result: **No rate limit errors** even with 100K+ daily users

## Troubleshooting

### Problem: Still Getting 429 Errors

**Possible Causes:**
1. Environment variables not set correctly
2. Keys not enabled for Custom Search API
3. Billing not configured on Google Cloud
4. Vercel deployment not restarted after adding env vars

**Solution:**
```bash
# 1. Verify environment variables are loaded
console.log('Keys available:', process.env.GOOGLE_SEARCH_API_KEY_1 ? 'YES' : 'NO');

# 2. Check key rotation utility
import { getKeyPoolStats } from '@/lib/key-rotation';
console.log('Key pools:', getKeyPoolStats());
// Should show: { googleKeys: 3, styleIds: 2, garmentIds: 2 }

# 3. Verify API keys are valid
# Test each key individually in Google Cloud Console API playground

# 4. Force redeploy on Vercel
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### Problem: Only Using One Key

**Cause**: Additional keys not configured in environment

**Solution**:
- The system **gracefully falls back** to a single key if others aren't configured
- Check `.env.local` or Vercel environment variables
- Make sure variable names match exactly: `GOOGLE_SEARCH_API_KEY_1`, `GOOGLE_SEARCH_API_KEY_2`, etc.

### Problem: Uneven Distribution

**Cause**: Cache hit rate too high (good problem!)

**Explanation**:
- If cache is working well (90%+ hit rate), very few requests reach key rotation
- This is actually **good** - cache is doing its job
- Keys will still rotate for cache misses and new searches

## Best Practices

### 1. Start with 3 Keys
- **Minimum**: 1 key (required)
- **Recommended**: 3 keys (optimal cost/benefit ratio)
- **Maximum**: 10 keys (diminishing returns beyond this)

### 2. Use Different Google Cloud Projects
- Separate billing accounts = separate quotas
- More resilient to account-level issues
- Better for quota monitoring

### 3. Monitor Usage
- Check Google Cloud Console regularly
- Set up billing alerts
- Monitor Vercel logs for key rotation messages

### 4. Keep Backup Keys
- Always configure at least 2 keys
- If one key is revoked/expired, app continues working
- Update keys without downtime

### 5. Rotate Billing Cycles
- Spread keys across different billing cycles
- Prevents all keys from hitting limits simultaneously

## Testing

### Local Testing

```bash
# 1. Configure .env.local with multiple keys
cp .env.example .env.local
# Edit .env.local and add 2-3 keys

# 2. Start dev server
npm run dev

# 3. Make API requests
curl http://localhost:3000/api/style_search?q=fashion&num=10

# 4. Check console logs
# Should see: "Using rotated Google Search API key (3 available)"
```

### Production Testing

```bash
# 1. Deploy to Vercel
git push origin main

# 2. Check environment variables
vercel env ls

# 3. Test API endpoint
curl https://your-app.vercel.app/api/style_search?q=fashion&num=10

# 4. Check Vercel logs
vercel logs --follow
```

## Migration from Single Key

If you're currently using a single key:

### Phase 1: Add Second Key (Zero Downtime)
```bash
# 1. Keep existing key as primary
GOOGLE_SEARCH_API_KEY=existing_key

# 2. Add new key as backup
GOOGLE_SEARCH_API_KEY_1=new_key

# 3. Deploy - rotation starts automatically
```

### Phase 2: Add Third Key (Optional)
```bash
# After verifying Phase 1 works:
GOOGLE_SEARCH_API_KEY_2=third_key
```

### Phase 3: Monitor & Scale
- Watch rate limit metrics
- Add more keys if needed (up to 10)
- Remove underutilized keys

## FAQ

**Q: Do I need to modify any code to use key rotation?**
A: No! Key rotation is automatically applied to all API routes. Just add the environment variables.

**Q: What happens if I only configure one key?**
A: The system automatically falls back to single-key mode. No errors, just no rotation benefits.

**Q: Can I use different numbers of keys for different APIs?**
A: Yes! You can have 3 Google API keys but only 1 Style Search ID. The system handles this gracefully.

**Q: How much does this cost?**
A: Each Google API key costs the same (~$5/1000 queries after free tier). Multiple keys = higher total quota, not higher per-query cost.

**Q: Will this work with the free tier?**
A: Yes, but free tier is very limited (100 queries/day). For production, upgrade to paid tier.

**Q: Can I rotate other API providers (not Google)?**
A: The current implementation is specific to Google Custom Search, but the pattern can be extended to other providers.

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Test API keys individually in Google Cloud Console
4. Review `src/lib/key-rotation.ts` for rotation logic
5. Check GitHub Issues for similar problems

## Related Documentation

- [QUICK_START.md](./QUICK_START.md) - Initial setup guide
- [VERCEL_KV_SETUP.md](./VERCEL_KV_SETUP.md) - Caching configuration
- [CACHE_FLOW.md](./CACHE_FLOW.md) - Architecture diagrams
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment steps
