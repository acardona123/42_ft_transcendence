import hvac
import os
from dotenv import load_dotenv, set_key

VAULT_ENV_FILE='/usr/src/app/vault/.env'

def is_connected(client):
	print(f"Is initialized :	{client.sys.is_initialized()}")
	print(f"Is sealed :			{client.sys.is_sealed()}")
	print(f"Is authenticated :	{client.is_authenticated()}")

def create_client(certs):
	load_dotenv(dotenv_path=VAULT_ENV_FILE, override=True)
	client = hvac.Client(
		url=f'{os.getenv('VAULT_HOSTNAME')}:{os.getenv('VAULT_PORT')}',
		token=os.getenv('VAULT_TOKEN'),
		cert=certs
	)
	return client

def initialize(certs):
	load_dotenv(dotenv_path=VAULT_ENV_FILE, override=True)
	client = hvac.Client(
		url=f'{os.getenv('VAULT_HOSTNAME')}:{os.getenv('VAULT_PORT')}',
		cert=certs,
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
			"CREATE ROLE \"{{name}}\" WITH LOGIN SUPERUSER PASSWORD '{{password}}' VALID UNTIL '{{expiration}}';"
			# "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO \"{{name}}\";"
		]
		client.secrets.database.create_role(
			name=name+'-role',
			db_name=name,
			creation_statements=creation_statements,
			default_ttl='1h',
			max_ttl='24h'
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