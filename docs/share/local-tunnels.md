# Local Tunnels for CampusReels

Share your local development server with others using secure tunnels.

## Cloudflare Tunnel (Recommended)

### Installation

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Windows (Chocolatey)
choco install cloudflared

# Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### Usage

```bash
# Start tunnel (creates random subdomain)
cloudflared tunnel --url http://localhost:3000

# Example output:
# 2024-01-15T10:30:00Z INF | Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
# https://random-words-1234.trycloudflare.com
```

### Features

- ✅ **Free forever**
- ✅ **HTTPS automatically**
- ✅ **No signup required**
- ✅ **Random subdomain**
- ✅ **Secure and fast**

### Custom Subdomain (Optional)

```bash
# Login to Cloudflare (optional)
cloudflared tunnel login

# Create named tunnel
cloudflared tunnel create campus-reels

# Configure tunnel
cloudflared tunnel route dns campus-reels campus-reels.yourdomain.com

# Run tunnel
cloudflared tunnel run campus-reels
```

## ngrok

### Installation

```bash
# macOS
brew install ngrok/ngrok/ngrok

# Windows (Chocolatey)
choco install ngrok

# Linux
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin
```

### Usage

```bash
# Start tunnel
ngrok http 3000

# Example output:
# Session Status                online
# Account                       your-email@example.com
# Version                       3.1.0
# Region                        United States (us)
# Latency                       45ms
# Web Interface                 http://127.0.0.1:4040
# Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

### Features

- ✅ **Free tier available**
- ✅ **HTTPS automatically**
- ✅ **Web interface for monitoring**
- ✅ **Custom subdomains (paid)**
- ✅ **Request inspection**

### Authentication (Optional)

```bash
# Sign up at ngrok.com and get auth token
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Use custom subdomain (paid feature)
ngrok http 3000 --subdomain=campus-reels
```

## Comparison

| Feature | Cloudflare Tunnel | ngrok |
|---------|-------------------|-------|
| **Free** | ✅ Forever | ✅ Limited |
| **HTTPS** | ✅ Auto | ✅ Auto |
| **Custom Domain** | ✅ Free | ❌ Paid |
| **Web Interface** | ❌ | ✅ |
| **Request Logs** | ❌ | ✅ |
| **Speed** | ⚡ Fast | ⚡ Fast |
| **Setup** | 🟢 Easy | 🟢 Easy |

## Security Considerations

### For Development Only

⚠️ **Important**: These tunnels expose your local development server to the internet. Only use for:

- ✅ **Demos and presentations**
- ✅ **Client previews**
- ✅ **Testing on mobile devices**
- ✅ **Team collaboration**

### Security Best Practices

1. **Don't expose production data**
2. **Use development/test databases only**
3. **Don't share sensitive API keys**
4. **Stop tunnels when not needed**
5. **Use authentication if possible**

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000

# Kill process
kill -9 PID

# Or use different port
npm run dev -- --port 3001
ngrok http 3001
```

#### Tunnel Not Working

```bash
# Check if local server is running
curl http://localhost:3000

# Restart tunnel
# Ctrl+C to stop, then restart
```

#### Slow Performance

- Use Cloudflare Tunnel (generally faster)
- Check your internet connection
- Try different regions (ngrok)

### Mobile Testing

#### Test on Phone

1. Start tunnel: `cloudflared tunnel --url http://localhost:3000`
2. Get the HTTPS URL from output
3. Open URL on your phone
4. Test all features

#### Test Responsive Design

- Use browser dev tools
- Test on actual devices
- Check touch interactions

## Advanced Usage

### Multiple Tunnels

```bash
# Terminal 1: Main app
cloudflared tunnel --url http://localhost:3000

# Terminal 2: API server (if separate)
cloudflared tunnel --url http://localhost:3001
```

### Persistent Tunnels

```bash
# Create config file
cat > ~/.cloudflared/config.yml << EOF
tunnel: campus-reels
credentials-file: /Users/$(whoami)/.cloudflared/12345678-1234-1234-1234-123456789012.json

ingress:
  - hostname: campus-reels.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# Run persistent tunnel
cloudflared tunnel run campus-reels
```

## Integration with Development

### Package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "tunnel": "cloudflared tunnel --url http://localhost:3000",
    "tunnel:ngrok": "ngrok http 3000",
    "dev:tunnel": "concurrently \"npm run dev\" \"npm run tunnel\""
  }
}
```

### Environment Variables

```bash
# Set tunnel URL as environment variable
export TUNNEL_URL="https://abc123.ngrok.io"
npm run dev
```

## Support

- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [ngrok Documentation](https://ngrok.com/docs)
- [Tunnel Troubleshooting](https://ngrok.com/docs/troubleshooting)
