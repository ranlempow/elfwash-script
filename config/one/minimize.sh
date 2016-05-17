#!/bin/bash

#dp0="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#source ${dp0}/bin/base.sh

source ${ONE_BASE}/set-env.sh

rm -rf ${PROJECT_BASE}/bin/node
rm -rf ${PROJECT_BASE}/bower_components
rm -rf ${PROJECT_BASE}/node_modules
rm -rf ${PROJECT_BASE}/dist
