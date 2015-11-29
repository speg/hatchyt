#!/bin/bash

SERVER=$DIR/../dist/server.js

if [[ -f process.id ]]; then
    echo "Process file already found. If you have manually stopped or crashed, please remve \`process.id\` before starting."
    exit 0
fi

if ! [[ -d .hatchyt ]]; then
    mkdir '.hatchyt'
fi


if ! [[ -f .hatchyt/settings.json ]]; then
    node $SERVER --initial
fi

nohup node $SERVER > startup.log 2>&1 &

echo $! > .hatchyt/process.id
echo "Hatchyt is now running! Run \`hatchyt stop\` to stop it."
