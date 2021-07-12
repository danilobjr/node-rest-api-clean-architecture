#!/bin/bash

# import .env vars
set -o allexport;
source .env;
set +o allexport;

# drop database
docker exec mongo sh -c "mongo ajuda-saude-dev -u $MONGO_USER -p $MONGO_PASSWORD  --authenticationDatabase admin --eval 'db.dropDatabase()'";

# restore database from mongodump.bakcup file
docker exec -i mongo sh -c 'mongorestore -u '"$MONGO_USER"' -p '"$MONGO_PASSWORD"' --authenticationDatabase admin --nsFrom="ajuda-saude-staging.*" --nsTo="ajuda-saude-dev.*" --archive' < mongodump.backup;