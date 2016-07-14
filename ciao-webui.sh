#!/bin/bash
OS=`uname`
LOCATION="." #executable
CONFIG_FILE="config_file=$LOCATION/share/ciao-webui/ciao_config.json"

if [ "$1" == "" ]; then
    env="production"
else
    env=$1
fi
echo "Environment: "$env

export NODE_ENV=$env

if [ "$2" == "" ]; then
    node $LOCATION/ciao-webui/bin/www "$CONFIG_FILE"

else
    node $LOCATION/ciao-webui/bin/www " $@"
fi
