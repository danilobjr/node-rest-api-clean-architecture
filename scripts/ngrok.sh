#!/bin/sh

sh scripts/base.sh

echo 'Starting development environment ...';
node nodemon/dev.js;
