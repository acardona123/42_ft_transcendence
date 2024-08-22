import os
from hvac_vault import *
from dotenv import load_dotenv

VAULT_ENV_FILE = '/usr/src/app/vault/.env'

os.environ['REQUESTS_CA_BUNDLE'] = '/usr/src/app/vault/vault.crt'

VAULT_CLIENT = initialize()

VAULT_CLIENT = unsealed(VAULT_CLIENT)

load_dotenv(dotenv_path=VAULT_ENV_FILE, override=True)

if VAULT_CLIENT.sys.is_initialized() == True \
	and VAULT_CLIENT.sys.is_sealed() == False \
 	and VAULT_CLIENT.is_authenticated() == False:
	VAULT_CLIENT.token = os.getenv('VAULT_TOKEN')

enable_database(VAULT_CLIENT)
configure_database(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))
create_role(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))
rotate_cred(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))

os.system("/bin/bash -c 'cd django; python3 ./manage.py makemigrations \
	&& python3 ./manage.py migrate && python3 ./manage.py runserver 0.0.0.0:8002'")