COMPOSE_FILE := infra/docker/docker-compose.yml

.PHONY: dev infra-up infra-stop infra-clean logs db-migrate

dev: ## Start dependencies and launch the API with air hot reload
	@docker compose -f $(COMPOSE_FILE) up -d
	@cd apps/api && air

infra-up: ## Start only infrastructure dependencies
	@docker compose -f $(COMPOSE_FILE) up -d

infra-stop: ## Stop containers without removing volumes
	@docker compose -f $(COMPOSE_FILE) stop

infra-clean: ## Stop containers and remove volumes
	@docker compose -f $(COMPOSE_FILE) down -v

logs: ## Tail logs from all containers
	@docker compose -f $(COMPOSE_FILE) logs -f

db-migrate: ## Run goose migrations using DATABASE_URL from the environment
	@cd apps/api && goose -dir db/migrations postgres "$$DATABASE_URL" up
