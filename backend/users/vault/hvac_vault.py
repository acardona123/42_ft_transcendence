import hvac
import os
from dotenv import load_dotenv, set_key

VAULT_ENV_FILE='/usr/src/app/vault/.env'

def is_connected(client):
	print(f"Is initialized :	{client.sys.is_initialized()}")
	print(f"Is sealed :			{client.sys.is_sealed()}")
	print(f"Is authenticated :	{client.is_authenticated()}")

def create_client():
	load_dotenv(dotenv_path=VAULT_ENV_FILE, override=True)
	client = hvac.Client(
		url=f'{os.getenv('VAULT_HOSTNAME')}:{os.getenv('VAULT_PORT')}',
		token=os.getenv('VAULT_TOKEN'),
	)
	return client

def initialize():
	load_dotenv(dotenv_path=VAULT_ENV_FILE, override=True)
	client = hvac.Client(
		url=f'{os.getenv('VAULT_HOSTNAME')}:{os.getenv('VAULT_PORT')}',
	)
	if client.sys.is_initialized() == False :
		shares = 5
		threshold = 3
		result = client.sys.initialize(shares, threshold)
		root_token = result['root_token']
		keys = result['keys']
		set_key(dotenv_path=VAULT_ENV_FILE, key_to_set="VAULT_TOKEN",\
			value_to_set=root_token)
		for i in range (0,5):
			set_key(dotenv_path=VAULT_ENV_FILE, key_to_set="VAULT_KEY"+str(i),
				value_to_set=keys[i])
	return client

def unsealed(client):
	if client.sys.is_initialized() == True and client.sys.is_sealed() == True:
		load_dotenv(dotenv_path=VAULT_ENV_FILE, override=True)
		for i in range (0,5):
			client.sys.submit_unseal_key(os.getenv('VAULT_KEY'+str(i)))
	return client

# ------------DATABASE-------------

def enable_database(client):
	secrets_engine = client.sys.list_mounted_secrets_engines()
	if 'database/' in secrets_engine:
		return
	client.sys.enable_secrets_engine(
		backend_type='database'
	)

def configure_database(client, name):
	try:
		new_cred = create_cred(client,name)
		return
	except:
		load_dotenv(override=True)
		client.secrets.database.configure(
			name=name,
			plugin_name='postgresql-database-plugin',
			allowed_roles=name+'-role',
			connection_url=f'postgresql://{{{{username}}}}:{{{{password}}}}@{name}:5432/{os.getenv("DB_NAME")}',
			username=os.getenv('DB_USER'),
			password=os.getenv('DB_PASSWORD'),
		)

def create_role(client, name):
	try:
		new_cred = create_cred(client,name)
		return
	except:
		creation_statements = [
			f"CREATE ROLE \"{{{{name}}}}\" WITH LOGIN PASSWORD '{{{{password}}}}'\
			VALID UNTIL '{{{{expiration}}}}' IN ROLE \"{os.getenv('DB_ROLE')}\" INHERIT;"
		]
		client.secrets.database.create_role(
			name=name+'-role',
			db_name=name,
			creation_statements=creation_statements,
			default_ttl='15m',
			max_ttl='1h'
		)

def rotate_cred(client, name):
	client.secrets.database.rotate_root_credentials(
		name=name
	)

def create_cred(client, name):
	credentials = client.secrets.database.generate_credentials(
		name=name+'-role'
	)
	return credentials

# ------------ KV -------------

def create_kv(client, path, secret):
	load_dotenv()
	client.secrets.kv.v1.create_or_update_secret(
		path=path,
		secret= secret,
	)

def read_kv(client, path):
	return client.secrets.kv.v1.read_secret(path=path)

def list_kv(client):
	return client.secrets.kv.v1.list_secrets(path='')
