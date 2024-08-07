all: run_django

up:
	docker compose up -d

run_django: up	
	docker exec -ti django bash

down:
	docker compose down