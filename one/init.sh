#!/bin/bash

dp0="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source ${dp0}/bin/base.sh
source ${dp0}/set-env.sh

BINDIR=${PROJECT_BASE}/bin

if [ ! -f ${BINDIR}\node ]; then
    NODEURL=https://nodejs.org/dist/v4.4.4/node-v4.4.4-linux-x64.tar.xz
    curl -O ${NODEURL}
    tar -xvfJp ${NODEURL##*/} -C ${PROJECT_BASE}/bin
    mv ${PROJECT_BASE}/bin/${NODEURL%.tar.xz} ${PROJECT_BASE}/bin/node
fi

npm install
bower install