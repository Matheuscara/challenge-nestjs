#!/bin/bash

echo "🚀 Starting development environment with hot reload..."
echo "📁 Volumes mounted for hot reload:"
echo "   - ./src → /usr/src/app/src"
echo "   - ./test → /usr/src/app/test"
echo ""

docker-compose up --build

echo ""
echo "✅ Development environment stopped!"
