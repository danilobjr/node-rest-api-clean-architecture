#!/bin/sh

#sh scripts/base.sh

echo 'Generating swagger files ...';
yarn openapi;

echo 'Starting development environment ...';
yarn dev;
