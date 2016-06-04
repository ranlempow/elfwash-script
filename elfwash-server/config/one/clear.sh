#!/bin/bash

rm -rf ${PROJECT_BASE}/bin/apps
rm -rf ${PROJECT_BASE}/bower_components
rm -rf ${PROJECT_BASE}/node_modules
rm -rf ${PROJECT_BASE}/dist

git gc
if [ "$1" == "--deep" ]; then
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
fi