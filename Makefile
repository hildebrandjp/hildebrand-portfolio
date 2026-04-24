# ==============================================================================
# Variables — edit here to change behaviour project-wide
# ==============================================================================
NPM          := npm
BUNDLE       := bundle exec
JEKYLL       := $(BUNDLE) jekyll
JEKYLL_FLAGS := --host 0.0.0.0 --incremental --force_polling
DOCKER_IMAGE := hildebrand
DOCKER_PORT  := 4000:4000
COMPOSE_FILE := docker-compose.yml

# ==============================================================================
.DEFAULT_GOAL := help
.PHONY: help \
        install \
        generate \
        build-js-dev build-js-prod watch \
        serve build-jekyll \
        dev build-dev build \
        clean \
        docker-build docker-run docker-up docker-down docker-rebuild

# ==============================================================================
# Help — auto-generated from ## comments
# ==============================================================================
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	  | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ==============================================================================
# Dependencies
# ==============================================================================
install: ## Install all dependencies (npm + bundle)
	$(NPM) install
	$(BUNDLE) install

# ==============================================================================
# Data
# ==============================================================================
generate: ## Generate skill data from resume HTML → _data/skill.json
	$(NPM) run build:skill-data

# ==============================================================================
# JavaScript (npm scripts handle prebuild/generate internally)
# ==============================================================================
build-js-dev: ## Build JS for development
	$(NPM) run build-js:dev

build-js-prod: ## Build JS for production
	$(NPM) run build-js:prod

watch: ## Watch and rebuild JS for development
	$(NPM) run watch-js:dev

# ==============================================================================
# Jekyll
# ==============================================================================
serve: ## Start Jekyll dev server (run `make watch` in a second terminal)
	$(JEKYLL) serve $(JEKYLL_FLAGS)

build-jekyll: ## Build Jekyll site to _site/
	$(JEKYLL) build

# ==============================================================================
# Combined workflows
# ==============================================================================
dev: ## Start full dev environment via foreman — Jekyll + JS watch in parallel
	@command -v foreman >/dev/null 2>&1 \
	  || (echo "foreman not found — install with: gem install foreman" && exit 1)
	foreman start -f Procfile.dev

build-dev: build-js-dev build-jekyll ## Full development build (JS dev + Jekyll)

build: build-js-prod build-jekyll ## Full production build (JS prod + Jekyll)

# ==============================================================================
# Clean
# ==============================================================================
clean: ## Remove built site output (_site/)
	rm -rf _site

# ==============================================================================
# Docker
# ==============================================================================
docker-build: ## Build Docker image
	docker build -t $(DOCKER_IMAGE) .

docker-run: docker-build ## Build image then run container
	docker run -p $(DOCKER_PORT) $(DOCKER_IMAGE)

docker-up: ## Start services via docker-compose
	docker-compose -f $(COMPOSE_FILE) up

docker-down: ## Stop docker-compose services
	docker-compose -f $(COMPOSE_FILE) down

docker-rebuild: ## Rebuild and restart docker-compose services
	docker-compose -f $(COMPOSE_FILE) up --build

# ==============================================================================
# WSL Permission - Quick fix for permission issues when running Docker in WSL
# ==============================================================================
permission-override: ## Override permissions for WSL / Linux users
	@echo "Overriding permissions for WSL..."
	@sudo chown -R $(USER):$(USER) ./*