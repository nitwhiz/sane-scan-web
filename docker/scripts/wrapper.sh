#!/bin/sh

echo "using $SANE_SCAN_API_URL as sane-scan-api url"

cp /usr/share/nginx/html/env.json.dist /usr/share/nginx/html/env.json
sed -i "s#SANE_SCAN_API_URL#$SANE_SCAN_API_URL#" /usr/share/nginx/html/env.json

exec nginx -g "daemon off;"
