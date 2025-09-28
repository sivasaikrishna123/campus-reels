# 🚀 CampusReels Deployment Guide

## Quick Deploy (5 Minutes)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy to Production
```bash
# From your project directory
vercel --prod
```

### 3. Set Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables:
```bash
VITE_APP_URL=https://your-project.vercel.app
VITE_SUPPORT_EMAIL=support@campusreels.com
```

## 📁 Files Created

### Deployment Configuration
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `.github/workflows/ci.yml` - GitHub Actions CI/CD pipeline
- ✅ `lighthouse.config.js` - Performance monitoring
- ✅ `audit-ci.json` - Security audit configuration

### Documentation
- ✅ `docs/deploy/vercel.md` - Complete Vercel deployment guide
- ✅ `docs/deploy/checklist.md` - Pre/post deployment checklist
- ✅ `docs/share/local-tunnels.md` - Local tunnel setup for demos
- ✅ `env.example` - Environment variables template

### Scripts
- ✅ `scripts/deploy.sh` - Automated deployment script
- ✅ Updated `package.json` with deployment scripts

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Quick deploy
npm run deploy

# Or use the script
./scripts/deploy.sh
```

### Option 2: Local Tunnels (For Demos)
```bash
# Cloudflare Tunnel (Free)
npm run tunnel

# ngrok (Alternative)
npm run tunnel:ngrok
```

### Option 3: Custom Domain
1. Add domain in Vercel dashboard
2. Configure DNS in GoDaddy:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

## 🔧 Environment Variables

### Required
```bash
VITE_APP_URL=https://your-project.vercel.app
VITE_SUPPORT_EMAIL=support@campusreels.com
```

### Optional
```bash
VITE_GEMINI_KEY=your_gemini_api_key
VITE_RESEND_API_KEY=your_resend_api_key
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your_email@gmail.com
VITE_SMTP_PASS=your_app_password
```

## 📊 Monitoring & Analytics

### Automatic (Vercel)
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Performance monitoring
- ✅ Error tracking
- ✅ Analytics

### Optional Additions
- Google Analytics
- Sentry error tracking
- Uptime monitoring

## 🚨 Troubleshooting

### Build Failures
```bash
# Test build locally
npm run test:build

# Check for errors
npm run type-check
npm run lint
```

### Environment Variables
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel dashboard → Functions → Environment Variables

### Domain Issues
- Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
- Verify DNS records in GoDaddy
- Check domain status in Vercel dashboard

## 📈 Performance

### Automatic Optimizations
- ✅ Code splitting
- ✅ Image optimization
- ✅ Static asset caching
- ✅ Edge functions
- ✅ Global CDN

### Lighthouse Scores Target
- Performance: 80+
- Accessibility: 90+
- Best Practices: 80+
- SEO: 80+

## 🔒 Security

### Automatic (Vercel)
- ✅ HTTPS/SSL certificates
- ✅ DDoS protection
- ✅ Security headers
- ✅ Environment variable encryption

### Best Practices
- ✅ No sensitive data in code
- ✅ Environment variables for secrets
- ✅ Regular dependency updates
- ✅ Security audits

## 📱 Mobile & PWA

### Features Included
- ✅ Responsive design
- ✅ Touch optimizations
- ✅ PWA manifest
- ✅ Service worker ready
- ✅ Mobile-first approach

## 🎉 Success Checklist

After deployment, verify:
- [ ] App loads at your URL
- [ ] All pages work correctly
- [ ] Forms submit successfully
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Performance is good
- [ ] No console errors

## 📞 Support

- [Vercel Documentation](https://vercel.com/docs)
- [CampusReels Issues](https://github.com/yourusername/campus-reels/issues)
- [Deployment Checklist](./docs/deploy/checklist.md)

---

**Your CampusReels app is now ready for the world! 🌍**
