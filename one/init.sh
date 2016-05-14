#!/bin/bash

dp0="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source ${dp0}/bin/base.sh
source ${ONE_BASE}/set-env.sh

BINDIR=${PROJECT_BASE}/bin

if [ ! -d ${BINDIR}/node ]; then
    NODEURL=https://nodejs.org/dist/v4.4.4/node-v4.4.4-linux-x64.tar.xz
    wget ${NODEURL}
    NODEFILE=${NODEURL##*/}
    tar -Jpxvf ${NODEFILE} -C ${PROJECT_BASE}/bin
    mv ${PROJECT_BASE}/bin/${NODEFILE%.tar.xz} ${PROJECT_BASE}/bin/node
    rm ${NODEFILE}
fi

npm install
bower install