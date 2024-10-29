import os
from hvac_vault import *
# from dotenv import load_dotenv

VAULT_ENV_FILE = '/usr/src/app/vault/.env'

VAULT_CLIENT = create_client()

configure_database(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))
create_role(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))
rotate_cred(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))

list = list_kv(VAULT_CLIENT)
if list['data']['keys'] == ['secret-key']:
	create_kv(VAULT_CLIENT, 'api-key', {'value': f"{os.getenv('API_KEY_RANDOM_WORD')}"})
	create_kv(VAULT_CLIENT, 'oauth-id', {'value': f"{os.getenv('CLIENT_ID')}"})
	create_kv(VAULT_CLIENT, 'oauth-secret', {'value': f"{os.getenv('CLIENT_SECRET')}"})
	create_kv(VAULT_CLIENT, 'oauth-state', {'value': f"{os.getenv('STATE')}"})

os.system("/bin/bash -c 'cd django; python3 ./manage.py makemigrations users\
	&& python3 ./manage.py migrate && \
	python3 ./manage.py runserver 0.0.0.0:8002'")
	# gunicorn app.wsgi:application --bind 0.0.0.0:8002  --log-level \"debug\"'")