#!/bin/sh

sh scripts/base.sh

echo 'Installing Node.js packages ...';
yarn --production=false;

echo 'Adding pm2 package globally ...';
npm i -g pm2;

echo 'Cleaning build folder ...';
yarn clear-build-folder;

echo 'Building ...';
yarn build;

echo 'Copying templates ...';
yarn copy-email-templates;

echo 'Starting ...';
yarn start;
