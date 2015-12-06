# Launch all the dev tools in watch mode.

# LOCAL!!
export HATCHY_ENV="dev"
STYLUS_BIN=$ROOT/node_modules/stylus/bin/stylus

# GLOBAL INSTASLLS - TODO: check if these exist 
if [[ -d $ROOT/node_modules/babel ]]
    then
        BABEL_BIN=$ROOT/node_modules/babel/bin/babel.js
    else
        echo "Could not find local babel, attempting global babel $(babel --version)"
        BABEL_BIN="babel"
fi

$BABEL_BIN --source-maps --watch --out-dir dist src &
sleep 2
$STYLUS_BIN -w --out dist/public/css src/public/styles &
webpack --config config/webpack.js --watch &

sleep 1
nodemon --debug --watch dist/server dist/server.js
