# Vercel KV Setup Guide

This guide explains how to set up Vercel KV for caching API responses in your Next.js project to prevent rate limits and reduce external API calls.

## Why Vercel KV?

- **Prevents 429 Rate Limit Errors**: Caches API responses to avoid repeated calls to external APIs
- **Faster Response Times**: Serves cached data instantly without waiting for upstream APIs
- **Cost Savings**: Reduces external API usage and associated costs
- **Resilience**: Serves stale cached data when upstream APIs are unavailable
- **Automatic Fallback**: Returns mock data when cache and API both fail

## Setup Steps

### 1. Create a Vercel KV Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **KV** (Key-Value Store)
5. Choose a name (e.g., `drip-cache`)
6. Select the region closest to your users
7. Click **Create**

### 2. Connect KV to Your Project

1. In the KV database dashboard, click **Connect to Project**
2. Select your Next.js project (`drip`)
3. Click **Connect**

Vercel will automatically add these environment variables to your project:

```
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

### 3. Local Development Setup

For local development, create a `.env.local` file in your project root and copy the environment variables from Vercel:

```bash
# .env.local
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

**Important**: Never commit `.env.local` to version control. It should already be in your `.gitignore`.

### 4. Verify Installation

The `@vercel/kv` package is already installed. To verify:

```bash
npm list @vercel/kv
```

You should see:
```
drip@0.1.0
└── @vercel/kv@2.x.x
```

## How It Works

### Cache Flow

```
Request → Check KV Cache → Cache Hit? 
                           ↓ Yes: Return cached data
                           ↓ No: Call external API → Cache response → Return data
                           
Rate Limited (429)? → Check KV for stale cache → Return stale OR mock data
```

### Cache Key Structure

Cache keys are generated from query parameters:
```
style_search:fashion:10:1:undefined:undefined:active:undefined:undefined
```

This ensures different queries are cached separately.

### Cache TTL (Time To Live)

- **Default**: 3600 seconds (1 hour)
- **Stale Cache**: Served indefinitely if API fails
- **Mock Fallback**: Always available as last resort

## Testing Locally

1. Start your dev server:
```bash
npm run dev
```

2. Make a request to the API:
```bash
curl "http://localhost:3000/api/style_search?q=fashion&num=10&start=1"
```

3. Check the console logs:
```
[KV Cache MISS] style_search:fashion:10:1:...
[KV Cache SET] style_search:fashion:10:1:... (TTL: 3600s)
```

4. Make the same request again:
```
[KV Cache HIT] style_search:fashion:10:1:...
```

## Monitoring Cache Performance

### Response Headers

The API includes cache status in the response:

```json
{
  "query": "fashion",
  "total": 10,
  "images": [...],
  "cached": true,      // Whether data came from cache
  "stale": false,      // Whether cache is stale (served during API failure)
  "fallback": false    // Whether mock data was returned
}
```

### Console Logs

The route logs detailed information:

- `[KV Cache HIT]` - Data served from cache
- `[KV Cache MISS]` - Fresh API call made
- `[KV Cache SET]` - Response cached successfully
- `[API Rate Limited]` - 429 error from upstream API
- `[Serving stale cache]` - Stale data served during API failure
- `[Fallback to mock data]` - Mock data returned as last resort

## Vercel Dashboard Monitoring

### KV Metrics

In your Vercel KV dashboard, you can monitor:

- **Total Keys**: Number of cached queries
- **Read Operations**: Cache hits
- **Write Operations**: New cache entries
- **Storage Used**: Total cache size

### Clearing Cache (If Needed)

To clear all cached data:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# List KV stores
vercel kv ls

# Flush all keys (use with caution!)
# This can be done via Vercel CLI or dashboard
```

## Cost Considerations

### Vercel KV Pricing (Hobby Plan)

- **Free Tier**: 
  - 256 MB storage
  - 30,000 commands/month
  - Sufficient for most small-to-medium projects

- **Pro Plan**:
  - More storage and commands available
  - See [Vercel Pricing](https://vercel.com/pricing/storage)

### Optimizing Costs

1. **Adjust Cache TTL**: Increase `CACHE_TTL` to cache data longer
2. **Cache Invalidation**: Implement selective cache clearing for outdated data
3. **Monitor Usage**: Check your KV dashboard regularly

## Troubleshooting

### Issue: "Cannot connect to KV"

**Solution**: 
- Verify environment variables are set in Vercel dashboard
- Check `.env.local` for local development
- Redeploy your project after adding environment variables

### Issue: "KV Set Error"

**Solution**:
- Check KV storage quota
- Verify KV database is active in Vercel dashboard
- Check network connectivity

### Issue: Still getting 429 errors

**Solution**:
- Check if cache is working (look for `[KV Cache HIT]` logs)
- Verify external API credentials are correct
- Consider increasing retry delays
- Review external API rate limits

### Issue: Stale data being served

**Solution**:
This is intentional behavior to ensure availability. To force fresh data:
1. Clear the specific cache key manually
2. Or wait for TTL expiration
3. Or implement cache invalidation endpoint

## Advanced Configuration

### Custom Cache TTL

Edit `src/app/api/style_search/route.ts`:

```typescript
const CACHE_TTL = 7200; // 2 hours
```

### Adjust Retry Logic

```typescript
const MAX_RETRIES = 3; // Increase retry attempts
const BASE_DELAY = 1000; // Increase base delay
```

### Conditional Caching

Only cache successful responses:

```typescript
if (images.length > 0) {
  await kv.set(cacheKey, responseData, { ex: CACHE_TTL });
}
```

## Security Best Practices

1. **Never expose KV tokens** in client-side code
2. **Use read-only tokens** for read-only operations when possible
3. **Rotate tokens** periodically
4. **Monitor usage** for unusual patterns

## Support

For issues related to:
- **Vercel KV**: [Vercel Support](https://vercel.com/support)
- **@vercel/kv package**: [GitHub Issues](https://github.com/vercel/storage/issues)
- **This implementation**: Check project README or open an issue

## References

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [@vercel/kv NPM Package](https://www.npmjs.com/package/@vercel/kv)
- [Redis Commands Reference](https://redis.io/commands)
