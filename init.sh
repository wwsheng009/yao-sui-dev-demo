#!/bin/bash
# Path to the .env file
ENV_FILE=".env"
mkdir db

# Check if the .env file exists
if [ -f "$ENV_FILE" ]; then
    echo ".env file found. Running 'yao migrate'..."
    # Run yao migrate
    /usr/local/bin/yao migrate
else
    echo ".env file not found. Copying from .env.sample..."
    cp .env.sample .env
    /usr/local/bin/yao migrate
fi
mv data/templates/default/template.json.bak data/templates/default/template.json
/usr/local/bin/yao sui build web default
/usr/local/bin/yao start