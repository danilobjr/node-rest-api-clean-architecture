include .env

.PHONY: dev
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

.PHONY: prod
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

.PHONY: down
down:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml -f docker-compose.prod.yml

.PHONY: restart
restart:
	docker container restart api

.PHONY: build
build:
	docker exec -it api sh -c "yarn build"

.PHONY: logs
logs:
	docker container logs -f api

.PHONY: importdb
importdb:
	bash ./scripts/utils/importdb.sh
