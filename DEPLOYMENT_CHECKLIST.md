# Deployment Checklist

## Pre-Deployment

- [x] Install `@vercel/kv` package
- [x] Modify `/api/style_search` route with KV caching
- [x] Add retry logic with exponential backoff
- [x] Implement mock data fallback
- [x] Add comprehensive logging
- [x] Test TypeScript compilation (`npm run build`)
- [x] Create documentation files

## Vercel KV Setup

- [ ] **Step 1**: Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] **Step 2**: Navigate to **Storage** tab
- [ ] **Step 3**: Click **Create Database** → Select **KV**
- [ ] **Step 4**: Name it `drip-cache` (or any name)
- [ ] **Step 5**: Click **Connect to Project** → Select `drip`
- [ ] **Step 6**: Verify environment variables are added automatically

## Local Testing

- [ ] **Step 7**: Copy KV environment variables from Vercel
- [ ] **Step 8**: Create `.env.local` file in project root
- [ ] **Step 9**: Paste environment variables:
  ```
  KV_URL=...
  KV_REST_API_URL=...
  KV_REST_API_TOKEN=...
  KV_REST_API_READ_ONLY_TOKEN=...
  ```
- [ ] **Step 10**: Start dev server: `npm run dev`
- [ ] **Step 11**: Test API endpoint:
  ```bash
  curl "http://localhost:3000/api/style_search?q=fashion&num=10"
  ```
- [ ] **Step 12**: Check console for `[KV Cache MISS]` → `[KV Cache SET]`
- [ ] **Step 13**: Make same request again
- [ ] **Step 14**: Check console for `[KV Cache HIT]`

## Deployment to Vercel

- [ ] **Step 15**: Commit all changes:
  ```bash
  git add .
  git commit -m "Add Vercel KV caching to prevent 429 rate limits"
  git push
  ```
- [ ] **Step 16**: Deploy automatically via Vercel GitHub integration
  - Or manually: `vercel --prod`

## Post-Deployment Verification

- [ ] **Step 17**: Test production API:
  ```bash
  curl "https://your-app.vercel.app/api/style_search?q=fashion&num=10"
  ```
- [ ] **Step 18**: Check Vercel logs:
  ```bash
  vercel logs --follow
  ```
- [ ] **Step 19**: Look for:
  - ✅ `[KV Cache HIT]` messages
  - ✅ `[KV Cache SET]` messages
  - ✅ No `[API Rate Limited]` errors (or very few)
- [ ] **Step 20**: Monitor Vercel KV dashboard:
  - Storage usage increasing
  - Read operations >> Write operations
  - Cache hit rate > 80%

## Performance Testing

- [ ] **Step 21**: Test cache miss (first request):
  ```bash
  curl "https://your-app.vercel.app/api/style_search?q=newquery&num=10"
  ```
  Expected: Response time 500-1000ms, `"cached": false`

- [ ] **Step 22**: Test cache hit (repeat request):
  ```bash
  curl "https://your-app.vercel.app/api/style_search?q=newquery&num=10"
  ```
  Expected: Response time <100ms, `"cached": true`

- [ ] **Step 23**: Test different queries to verify separate caching:
  ```bash
  curl "https://your-app.vercel.app/api/style_search?q=streetwear&num=10"
  curl "https://your-app.vercel.app/api/style_search?q=minimal&num=10"
  ```

## Error Handling Tests

- [ ] **Step 24**: Test invalid query (should return mock data):
  ```bash
  curl "https://your-app.vercel.app/api/style_search?q=xyzabc123&num=10"
  ```
  Expected: Mock data with `"fallback": true`

- [ ] **Step 25**: Monitor for 429 errors over 24 hours
  - Should be **zero** or extremely rare
  - If seen, check cache is working properly

## Monitoring Setup

- [ ] **Step 26**: Set up Vercel monitoring
  - Go to project → **Analytics**
  - Check response times
  - Look for error rates

- [ ] **Step 27**: Set up alerts (optional):
  - Vercel → Project Settings → Integrations
  - Add Slack/Discord/Email alerts for errors

- [ ] **Step 28**: Bookmark Vercel KV dashboard for regular checks:
  ```
  https://vercel.com/[your-org]/[your-project]/stores/[kv-store]
  ```

## Cost Monitoring

- [ ] **Step 29**: Track KV usage weekly:
  - Storage used / 256 MB
  - Commands used / 30K per month
  
- [ ] **Step 30**: Track external API usage reduction:
  - Before: ~100 calls/day
  - After: ~5-10 calls/day (90-95% reduction)

## Documentation Review

- [ ] **Step 31**: Review created documentation:
  - [x] `QUICK_START.md` - Fast 5-minute setup
  - [x] `VERCEL_KV_SETUP.md` - Detailed setup guide
  - [x] `IMPLEMENTATION_SUMMARY.md` - Technical details
  - [x] `CACHE_FLOW.md` - Architecture diagrams
  - [x] `.env.example` - Environment template

## Success Criteria

### ✅ All Green = Successful Deployment

- [ ] KV database created and connected
- [ ] Environment variables configured
- [ ] Local testing passed
- [ ] Production deployment successful
- [ ] API responses include `"cached": true` on repeated requests
- [ ] Response times < 100ms for cached requests
- [ ] No 429 errors in logs
- [ ] KV dashboard shows activity (reads/writes)
- [ ] Cache hit rate > 80%
- [ ] External API calls reduced by 90%+

## Rollback Plan (If Needed)

If something goes wrong, you can quickly rollback:

```bash
# Revert to previous deployment
vercel rollback

# Or revert the git commit
git revert HEAD
git push
```

The old route will work without KV (it just won't have caching).

## Next Steps After Deployment

1. **Week 1**: Monitor logs and KV usage daily
2. **Week 2**: Check for any 429 errors or cache misses
3. **Week 3**: Analyze cost savings and performance improvements
4. **Week 4**: Adjust cache TTL if needed (increase for more savings)

## Common Issues & Solutions

### Issue: "Cannot connect to KV"
- **Solution**: Verify environment variables in Vercel dashboard
- **Check**: Project Settings → Environment Variables

### Issue: "Build failed"
- **Solution**: Check TypeScript errors with `npm run build`
- **Verify**: `@vercel/kv` is in `package.json`

### Issue: "Still getting 429 errors"
- **Solution**: Check logs for `[KV Cache HIT]` messages
- **Verify**: Cache is actually working
- **Action**: May need to increase cache TTL or check API quotas

### Issue: "Serving stale data"
- **Expected**: This is intentional for high availability
- **Action**: If problematic, reduce cache TTL or add invalidation

## Support Resources

- **Vercel KV Docs**: https://vercel.com/docs/storage/vercel-kv
- **@vercel/kv Package**: https://www.npmjs.com/package/@vercel/kv
- **Vercel Support**: https://vercel.com/support

## Timeline

- **Setup**: 5 minutes
- **Testing**: 5 minutes
- **Deployment**: 2 minutes
- **Verification**: 5 minutes
- **Total**: ~17 minutes

---

**Status**: Ready to deploy! 🚀

**Last Updated**: October 6, 2025
