#!/bin/sh

echo "using $SANE_SCAN_API_URL as sane-scan-api url"
echo "using $STAGECOACH_API_URL as stagecoach-api url"
echo "using $GOTENBERG_API_URL as gotenberg-api url"

cp /usr/share/nginx/html/env.json.dist /usr/share/nginx/html/env.json

sed -i "s#SANE_SCAN_API_URL#$SANE_SCAN_API_URL#" /usr/share/nginx/html/env.json
sed -i "s#STAGECOACH_API_URL#$STAGECOACH_API_URL#" /usr/share/nginx/html/env.json
sed -i "s#GOTENBERG_API_URL#$GOTENBERG_API_URL#" /usr/share/nginx/html/env.json

exec nginx -g "daemon off;"
