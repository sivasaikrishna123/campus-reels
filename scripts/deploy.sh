#!/bin/bash

# CampusReels Deployment Script
# This script helps deploy the app to Vercel with proper checks

set -e  # Exit on any error

echo "🚀 CampusReels Deployment Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run type check
print_status "Running TypeScript type check..."
npm run type-check

# Run linting
print_status "Running ESLint..."
npm run lint

# Run security audit
print_status "Running security audit..."
npm audit --audit-level=moderate

# Test build
print_status "Testing build process..."
npm run build

print_success "Build completed successfully!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

print_success "Vercel CLI version: $(vercel --version)"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please log in:"
    vercel login
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."

if [ "$1" = "--preview" ]; then
    print_status "Deploying preview version..."
    vercel
else
    print_status "Deploying to production..."
    vercel --prod
fi

print_success "Deployment completed!"
print_status "Your app should be available at the URL provided above."

# Check if .env.example exists
if [ -f "env.example" ]; then
    print_warning "Don't forget to set up environment variables in Vercel dashboard:"
    print_status "1. Go to your project in Vercel dashboard"
    print_status "2. Navigate to Settings → Environment Variables"
    print_status "3. Add the variables from env.example"
    print_status "4. Redeploy if needed"
fi

print_success "🎉 CampusReels deployment completed successfully!"
