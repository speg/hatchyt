#!/bin/bash
#  Build and package source files.

babel --source-maps --out-dir dist src
webpack --config config/webpack.js

STYLUS_BIN=node_modules/stylus/bin/stylus

if ! [[ -d dist/public/css ]] ; then
    mkdir dist/public/css
fi

$STYLUS_BIN --out dist/public/css src/public/styles
