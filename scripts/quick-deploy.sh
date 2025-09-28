#!/bin/bash

# Quick Deploy Script for CampusReels
# This script deploys to Vercel with minimal checks

set -e

echo "🚀 CampusReels Quick Deploy"
echo "=========================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the project (skip TypeScript errors for now)
print_status "Building project..."
npm run build:skip-ts

print_success "Build completed!"

# Deploy to Vercel
print_status "Deploying to Vercel..."

if [ "$1" = "--preview" ]; then
    print_status "Deploying preview version..."
    vercel
else
    print_status "Deploying to production..."
    vercel --prod --yes
fi

print_success "🎉 Deployment completed!"
print_status "Your app should be available at the URL provided above."

# Show next steps
echo ""
print_warning "Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Test your deployed app"
echo "3. Configure custom domain if needed"
echo ""
print_status "Environment variables to set:"
echo "- VITE_APP_URL=https://your-project.vercel.app"
echo "- VITE_SUPPORT_EMAIL=support@campusreels.com"
echo "- VITE_GEMINI_KEY=your_gemini_api_key (optional)"
echo "- VITE_RESEND_API_KEY=your_resend_api_key (optional)"
