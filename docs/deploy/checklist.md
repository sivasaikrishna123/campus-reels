# CampusReels Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented
- [ ] Code follows project conventions
- [ ] All features tested locally

### ✅ Dependencies
- [ ] All dependencies are up to date
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Package-lock.json is committed
- [ ] No unused dependencies

### ✅ Environment Variables
- [ ] All required environment variables documented
- [ ] `.env.example` file is up to date
- [ ] No sensitive data in code
- [ ] Production environment variables ready

### ✅ Build Process
- [ ] `npm run build` completes successfully
- [ ] Build output is optimized
- [ ] No build warnings
- [ ] Static assets are properly referenced

### ✅ Testing
- [ ] All tests pass
- [ ] Manual testing completed
- [ ] Cross-browser compatibility checked
- [ ] Mobile responsiveness verified

## Deployment Steps

### 1. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### 2. Environment Variables Setup

In Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Required
VITE_APP_URL=https://your-project.vercel.app
VITE_SUPPORT_EMAIL=support@campusreels.com

# Optional
VITE_GEMINI_KEY=your_gemini_api_key
VITE_RESEND_API_KEY=your_resend_api_key
```

### 3. Custom Domain Setup (Optional)

#### GoDaddy DNS Configuration:
- **A Record**: `@` → `76.76.21.21`
- **CNAME**: `www` → `cname.vercel-dns.com`

#### Vercel Domain Setup:
1. Go to Project → Settings → Domains
2. Add your domain
3. Wait for DNS propagation
4. Verify HTTPS is enabled

## Post-Deployment Checklist

### ✅ Functionality
- [ ] All pages load correctly
- [ ] Navigation works properly
- [ ] Forms submit successfully
- [ ] API calls work (if applicable)
- [ ] File uploads work
- [ ] Search functionality works

### ✅ Performance
- [ ] Page load times are acceptable
- [ ] Images are optimized
- [ ] No console errors
- [ ] Lighthouse scores are good
- [ ] Mobile performance is good

### ✅ Security
- [ ] HTTPS is enabled
- [ ] No sensitive data exposed
- [ ] Environment variables are secure
- [ ] CORS is configured properly
- [ ] Security headers are set

### ✅ SEO & Analytics
- [ ] Meta tags are correct
- [ ] Open Graph tags are set
- [ ] Sitemap is generated
- [ ] Analytics is working
- [ ] Search console is configured

## Monitoring Setup

### ✅ Error Tracking
- [ ] Sentry is configured (optional)
- [ ] Error boundaries are in place
- [ ] Logging is set up

### ✅ Analytics
- [ ] Google Analytics is configured
- [ ] Vercel Analytics is enabled
- [ ] Custom events are tracked

### ✅ Uptime Monitoring
- [ ] Uptime monitoring is set up
- [ ] Alerts are configured
- [ ] Response time monitoring

## Rollback Plan

### If Deployment Fails:
1. Check Vercel dashboard for build logs
2. Review environment variables
3. Test build locally
4. Fix issues and redeploy

### If Issues Found Post-Deployment:
1. Check Vercel function logs
2. Review browser console errors
3. Test on different devices/browsers
4. Rollback to previous version if needed

## Maintenance

### ✅ Regular Tasks
- [ ] Monitor performance metrics
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Backup data (if applicable)
- [ ] Monitor error rates

### ✅ Updates
- [ ] Keep Vercel CLI updated
- [ ] Monitor for breaking changes
- [ ] Test updates in staging first
- [ ] Document any configuration changes

## Troubleshooting

### Common Issues:

#### Build Failures
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

#### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel dashboard → Functions → Environment Variables

#### Domain Not Working
- Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
- Verify DNS records in GoDaddy
- Check domain status in Vercel dashboard

#### Performance Issues
- Check Vercel Analytics
- Run Lighthouse audit
- Optimize images and assets
- Review bundle size

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)
- [CampusReels Issues](https://github.com/yourusername/campus-reels/issues)

## Emergency Contacts

- **Technical Lead**: [Your Name] - [your-email@example.com]
- **DevOps**: [DevOps Contact] - [devops-email@example.com]
- **Vercel Support**: [Vercel Support Portal](https://vercel.com/support)
