# node-rest-api-clean-architecture

> This is a work in progress

## Table of Content

- Requirements
  - Node.js
  - MongoDB
  - Docker
  - Make
- Running
- Architecture
  - Overview
- Docs
  - Swagger (api.yml)
- Troubleshooting

## Running

Install dependencies

```bash
yarn install
```

Execute docker containers through Make. This will install Docker image and make them interact each other via Docker Compose.

```bash
make dev
```

Check application logs on terminal

```bash
make logs
```

Stop all containers

```bash
make down
```

## Database

### Modeling - Denormalization

Motivation: [Populate - Query conditions](https://mongoosejs.com/docs/populate.html#query-conditions)

## Troubleshooting

- Check express.js logs with `make logs`
- Use postman (or something like this) for direct requests
