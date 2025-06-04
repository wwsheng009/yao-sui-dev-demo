#!/bin/bash
# Path to the .env file
ENV_FILE=".env"
mkdir db

YAO_PATH="/usr/bin/yao"
if [ -f "/usr/local/bin/yao" ]; then
    YAO_PATH="/usr/local/bin/yao"
else
    YAO_PATH=$(which yao)
fi
# Check if the .env file exists
if [ -f "$ENV_FILE" ]; then
    echo ".env file found. Running 'yao migrate'..."
    # Run yao migrate
    $YAO_PATH migrate
else
    echo ".env file not found. Copying from .env.sample..."
    cp .env.sample .env
    $YAO_PATH migrate
fi
mv data/templates/default/template.json.bak data/templates/default/template.json
$YAO_PATH run scripts.tests.AppSetup
$YAO_PATH sui build web default
$YAO_PATH start