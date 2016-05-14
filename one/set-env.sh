#!/bin/bash

dp0="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source ${dp0}/bin/base.sh

PATH=${PROJECT_BASE}/bin/node:${PATH}
PATH=${PROJECT_BASE}/node_modules/.bin:${PATH}
