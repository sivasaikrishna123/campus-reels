#!/bin/bash

echo "🚀 Setting up GitHub Pages for permanent URL..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "📥 Installing GitHub CLI..."
    brew install gh
fi

# Login to GitHub (will prompt for authentication)
echo "🔐 Please login to GitHub..."
gh auth login

# Create a new repository
echo "📁 Creating GitHub repository..."
gh repo create campus-reels-app --public --description "CampusReels - Instagram-style app for university students with MAT reels and video playback"

# Add remote origin
git remote add origin https://github.com/$(gh api user --jq .login)/campus-reels-app.git

# Push to GitHub
echo "📤 Pushing code to GitHub..."
git push -u origin main

# Enable GitHub Pages
echo "🌐 Enabling GitHub Pages..."
gh api repos/$(gh api user --jq .login)/campus-reels-app/pages -X POST -f source[branch]=main -f source[path]=/

echo ""
echo "✅ Setup complete!"
echo "🌍 Your permanent URL will be:"
echo "   https://$(gh api user --jq .login).github.io/campus-reels-app"
echo ""
echo "⏳ It may take 5-10 minutes for GitHub Pages to deploy."
echo "🎬 Your MAT reels will be playable at the permanent URL!"
