#!/usr/bin/bash

echo "window.VITE_APP_BACKEND = '$VITE_APP_BACKEND'" > /var/www/html/config.js

nginx -g "daemon off;"