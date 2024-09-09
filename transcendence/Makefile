all: run_django

up:
	docker compose up -d

migrate: up	
	docker exec -ti django python manage.py migrate

run_django: migrate
	docker exec -ti django bash

down:
	docker compose down