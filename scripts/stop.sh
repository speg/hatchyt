#!/bin/bash

if [[ ! -f .hatchyt/process.id ]]; then
    echo "No process found."
    exit 0
fi

kill -9 `cat .hatchyt/process.id` && echo "Everything is stopped."
rm .hatchyt/process.id