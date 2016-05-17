#!/bin/bash

#dp0="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#source ${dp0}/bin/base.sh
#source ${ONE_BASE}/set-env.sh

BINDIR=${PROJECT_BASE}/bin
if [ -z "$NODE_VERSION" ]; then
    NODE_VERSION="5.7.1"
fi

if [ ! -d ${BINDIR}/node ]; then
    if [ "$PLATFROM" == "OSX" ]; then
        NODEURL=https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-x64.tar.gz
    elif [ "$PLATFROM" == "Linux" ]; then
        NODEURL=https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz
    fi
    wget ${NODEURL}
    NODEFILE=${NODEURL##*/}
    tar -Jpxvf ${NODEFILE} -C ${PROJECT_BASE}/bin
    mv ${PROJECT_BASE}/bin/${NODEFILE%.tar.xz} ${PROJECT_BASE}/bin/node
    rm ${NODEFILE}
fi

npm install
bower install