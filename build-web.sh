#!/bin/bash
echo "🏗️  Building web version..."
npm install
npm run build:web
echo "✅ Web build complete!"
