
echo "Styling and Profiling!"
BASE=$(pwd)
STYLUS_BIN=$BASE/node_modules/stylus/bin/stylus

$STYLUS_BIN $BASE/src/public/css/*.styl -w &
