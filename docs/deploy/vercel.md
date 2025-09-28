# Deploy CampusReels to Vercel

This guide will help you deploy your CampusReels app to Vercel for a public URL.

## Prerequisites

- Node.js 18+ installed
- Vercel account (free at [vercel.com](https://vercel.com))
- Git repository (GitHub, GitLab, or Bitbucket)

## Quick Deploy

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy to Vercel

From your project directory:

```bash
# First deployment (preview)
vercel

# Production deployment
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (for first time)
- **Project name** → `campus-reels` (or your preferred name)
- **Directory** → `./` (current directory)
- **Override settings?** → No

### 3. Set Environment Variables

In the Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add the following variables:

```bash
# App Configuration
VITE_APP_URL=https://your-project.vercel.app
VITE_SUPPORT_EMAIL=support@campusreels.com

# Email Configuration (Optional)
VITE_RESEND_API_KEY=your_resend_api_key_here
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your_email@gmail.com
VITE_SMTP_PASS=your_app_password
VITE_SMTP_SECURE=false

# AI Configuration (Optional)
VITE_GEMINI_KEY=your_gemini_api_key_here
```

### 4. Redeploy

After setting environment variables:

```bash
vercel --prod
```

## Custom Domain (GoDaddy)

### 1. Add Domain in Vercel

1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain: `yourdomain.com`
4. Click **Add**

### 2. Configure DNS in GoDaddy

In your GoDaddy DNS management:

#### A Record
- **Type**: A
- **Host**: `@`
- **Points to**: `76.76.21.21`
- **TTL**: 600 (10 minutes)

#### CNAME Record
- **Type**: CNAME
- **Host**: `www`
- **Points to**: `cname.vercel-dns.com`
- **TTL**: 600 (10 minutes)

### 3. Wait for DNS Propagation

- DNS changes can take 5-60 minutes to propagate
- Vercel will automatically provision SSL certificates
- Check status in Vercel dashboard → **Domains**

### 4. Verify HTTPS

Once DNS propagates:
- Your site will be available at `https://yourdomain.com`
- HTTPS is automatically enabled by Vercel
- Both `www` and non-www versions will work

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_APP_URL` | Yes | Your app's public URL |
| `VITE_SUPPORT_EMAIL` | Yes | Support email address |
| `VITE_RESEND_API_KEY` | No | Resend API key for emails |
| `VITE_SMTP_HOST` | No | SMTP server host |
| `VITE_SMTP_PORT` | No | SMTP server port |
| `VITE_SMTP_USER` | No | SMTP username |
| `VITE_SMTP_PASS` | No | SMTP password |
| `VITE_SMTP_SECURE` | No | Use SSL/TLS |
| `VITE_GEMINI_KEY` | No | Google Gemini API key |

## Troubleshooting

### Build Failures

If deployment fails:

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

### Environment Variables Not Working

1. Ensure variables start with `VITE_`
2. Redeploy after adding variables
3. Check Vercel dashboard → **Functions** → **Environment Variables**

### Domain Not Working

1. Check DNS propagation: [whatsmydns.net](https://whatsmydns.net)
2. Verify DNS records in GoDaddy
3. Check domain status in Vercel dashboard

## Performance Optimization

### Automatic Optimizations

Vercel automatically provides:
- Global CDN
- Automatic HTTPS
- Image optimization
- Edge functions
- Analytics

### Manual Optimizations

1. **Enable compression** in `vercel.json`
2. **Set cache headers** for static assets
3. **Use Vercel Analytics** for performance monitoring

## Monitoring

### Vercel Analytics

1. Go to project → **Analytics**
2. Enable **Web Analytics**
3. Monitor Core Web Vitals

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Hotjar for user behavior

## Cost

### Free Tier Limits

- 100GB bandwidth/month
- 100 serverless function executions
- 1,000 build minutes/month
- Unlimited static sites

### Pro Tier ($20/month)

- 1TB bandwidth/month
- Unlimited serverless functions
- Unlimited build minutes
- Advanced analytics

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)
