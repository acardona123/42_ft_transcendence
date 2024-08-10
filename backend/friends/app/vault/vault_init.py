from hvac_vault import *

os.environ["VAULT_HOSTNAME"] = 'http://vault'
os.environ["VAULT_PORT"] = str(8200)
os.environ["VAULT_DATABASE_NAME"] = 'friends_db'

VAULT_CLIENT = initialize(os.getenv("VAULT_HOSTNAME"), os.getenv("VAULT_PORT"))

VAULT_CLIENT = unsealed(VAULT_CLIENT)
if VAULT_CLIENT.sys.is_initialized() == True \
	and VAULT_CLIENT.sys.is_sealed() == False \
 	and VAULT_CLIENT.is_authenticated() == False:
	VAULT_CLIENT.token = os.getenv('VAULT_TOKEN')

enable_database(VAULT_CLIENT)
configure_database(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))
create_role(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))
rotate_cred(VAULT_CLIENT, os.getenv("VAULT_DATABASE_NAME"))

os.system("/bin/bash -c 'python3 ./manage.py makemigrations && python3 ./manage.py migrate && python3 ./manage.py runserver 0.0.0.0:8002'")