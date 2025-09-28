#!/bin/bash

echo "🚀 Deploying CampusReels to GitHub Pages..."

# Build the app with correct base path
echo "📦 Building the app with GitHub Pages base path..."
npm run build:skip-ts

# Copy built files to root for GitHub Pages
echo "📁 Preparing files for GitHub Pages..."
cp -r dist/* .

# Add and commit changes
echo "📤 Committing changes..."
git add .
git commit -m "Deploy to GitHub Pages: $(date)"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment complete!"
echo "🌍 Your permanent URL: https://sivasaikrishna123.github.io/campus-reels/"
echo "⏳ It may take 5-10 minutes for changes to appear."
echo "🎬 Your MAT reels are now live and playable!"
echo ""
echo "🔧 If you see a blank page, wait 5-10 minutes for GitHub Pages to update."
