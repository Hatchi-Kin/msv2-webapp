#!/bin/sh
set -e

# Default API URL if not provided
API_URL=${VITE_API_BASE_URL:-http://localhost:8000}

echo "🔧 Injecting API URL: $API_URL"

# Create runtime config that will be loaded by the app
cat > /usr/share/nginx/html/config.js <<EOF
window.ENV = {
  VITE_API_BASE_URL: "$API_URL"
};
EOF

echo "✅ Configuration injected successfully"

# Execute the CMD
exec "$@"
