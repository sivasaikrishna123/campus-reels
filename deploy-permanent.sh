#!/bin/bash

echo "🚀 Setting up permanent URL for CampusReels..."

# Build the app
echo "📦 Building the app..."
npm run build:skip-ts

# Create a simple server for the built files
echo "🌐 Creating permanent URL..."

# Use Python's built-in server (works on most systems)
cd dist
echo "✅ Your app is now running at:"
echo "📍 Local: http://localhost:8080"
echo "🌍 To make it accessible from anywhere, use ngrok:"
echo "   ngrok http 8080"
echo ""
echo "🎬 Your MAT reels are ready to play!"
echo ""

# Start the server
python3 -m http.server 8080
