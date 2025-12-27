#!/bin/bash

# SolVida Clean Deployment Script
# Kullanım: ./deploy.sh [production|staging]

set -e  # Exit on error

ENVIRONMENT=${1:-production}
echo "🚀 Deploying to $ENVIRONMENT environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env file with production variables."
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Build frontend
echo -e "${YELLOW}🔨 Building frontend...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed! dist folder not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${YELLOW}📁 Build output: dist/${NC}"

# Display deployment instructions
echo ""
echo -e "${GREEN}📋 Next steps:${NC}"
echo "1. Upload the following to your server via SFTP:"
echo "   - dist/ (frontend build)"
echo "   - server/ (backend)"
echo "   - public/ (static assets)"
echo "   - package.json"
echo "   - package-lock.json"
echo "   - .env (production environment variables)"
echo "   - ecosystem.config.js (PM2 config)"
echo ""
echo "2. SSH into your server and run:"
echo "   npm install --production"
echo "   pm2 start ecosystem.config.js"
echo ""
echo "3. Configure your web server (nginx/apache) to:"
echo "   - Serve static files from dist/"
echo "   - Proxy /api requests to http://localhost:3001"
echo ""

