# Ajuda Saude API

> Description

## Table of Content

- Requirements
  - Node.js
  - MongoDB
  - Redis
  - SMTP
  - .env file
- Running
  - Locally
  - Staging
  - Production
- Architecture
  - Overview
  - Example: how to add a new use case?
- Docs
  - Swagger (api.yml)
  - Postman (ajuda saude team)
- Deploy
- Database
  - Restore backup
  - Modeling - Denormalization
- Troubleshooting

## Deploy (staging)

- Prepare `staging` branch
- Access AWS EC2 through SSH
- Access project foler
- Pull `staging` branch

**Note: always check with `git status` if you are on correct EC2 machine**

## Database

### Restore backup

Run local containers

```
make dev
```

Check if server is running

```
make logs
```

Remove local `ajuda-saude-dev` database

```
docker exec mongo sh -c 'mongo ajuda-saude-dev -u <user> -p <password> --authenticationDatabase admin --eval "db.dropDatabase()"'
```

Restore backup on local database

```
docker exec -i mongo sh -c 'mongorestore --uri="mongodb://<user>:<password>@0.0.0.0:27017/?authSource=admin&readPreference=primary" --nsFrom="ajuda-saude.*" --nsTo="ajuda-saude-dev.*" --archive' < mongodump-YYYY-MM-DD-HH-mm.backup
```

### Modeling - Denormalization

Motivation: [Populate - Query conditions](https://mongoosejs.com/docs/populate.html#query-conditions)

## Troubleshooting

- Check express.js logs with `make logs`
- Use postman for direct requests
