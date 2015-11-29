#!/bin/bash

export ROOT=$(pwd)

if [[ "$1" == "-h" || "$1" == "--help" ]] ; then
    echo "Usage: `basename $0` command

Available commands:
    start - starts hatchyt in the current directory
    stop  - stops hatchyt
    help  - shows this screen"
    exit 0
fi

# BOOTSTRAP INTO A SCRIPT

# echo "Looking up source to installation.."
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

if ! [[ -f $DIR/$1.sh ]] ; then
    echo "'$1' is not a valid command.
    See hatchyt --help for available options."
    exit 0
fi

source $DIR/$1.sh

# Misc. commands
# "restore": "sqlite3 -csv .hatchyt/database.db '.import $1.sqlite sites'",
# "dump": "mkdir -p backups && sqlite3 -csv .hatchyt/database.db 'SELECT * FROM sites' > backups/`date '+%Y-%m-%d'`_backup.sqlite"
