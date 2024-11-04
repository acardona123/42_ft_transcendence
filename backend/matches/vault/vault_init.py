import os
from hvac_vault import *

VAULT_ENV_FILE = '/usr/src/app/vault/.env'

VAULT_CLIENT = create_client()

configure_database(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))
create_role(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))
rotate_cred(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))

os.system("/bin/bash -c 'cd django; python3 ./manage.py makemigrations matches\
	&& python3 ./manage.py migrate && \
	gunicorn app.wsgi:application --bind 0.0.0.0:8004 --workers=3'")
	# python3 ./manage.py runserver 0.0.0.0:8004'")