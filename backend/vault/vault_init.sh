#!/usr/bin/sh
set -e

#add crt to volume
cp /vault/tls/vault.crt /vault/env/

vault server -config=/vault/config/config.hcl &
pid=$!

while [ -z "$(curl -XGET --insecure --silent -H "X-Vault-Token: $VAULT_TOKEN" \
		$VAULT_ADDR/v1/sys/health | jq '.initialized')" ] 
do
	echo 'Vault is Starting...'
	sleep 1
done

if [ -s /vault/file/keys ]; then
	#unseal vault with 3 keys
	echo 'Unseal vault server ...'
	vault operator unseal $(grep 'Key 1:' /vault/file/keys | awk '{print $NF}') 2>&1 > /dev/null;
	vault operator unseal $(grep 'Key 2:' /vault/file/keys | awk '{print $NF}') 2>&1 > /dev/null;
	vault operator unseal $(grep 'Key 3:' /vault/file/keys | awk '{print $NF}') 2>&1 > /dev/null;
else
	#init vault
	echo 'Init vault server ...'
	vault operator init > /vault/file/keys;

	#unseal vault with 3 keys
	echo 'Unseal vault server ...'
	vault operator unseal $(grep 'Key 1:' /vault/file/keys | awk '{print $NF}') 2>&1 > /dev/null;
	vault operator unseal $(grep 'Key 2:' /vault/file/keys | awk '{print $NF}') 2>&1 > /dev/null;
	vault operator unseal $(grep 'Key 3:' /vault/file/keys | awk '{print $NF}') 2>&1 > /dev/null;

	#log in vault
	echo 'Log in vault server ...'
	export ROOT_TOKEN=$(grep 'Initial Root Token:' /vault/file/keys | awk '{print $NF}');
	vault login $ROOT_TOKEN 2>&1 > /dev/null;

	#update .env with VAULT_TOKEN
	env=$(grep -v VAULT_TOKEN < /vault/env/.env)
	echo $env | tr " " "\n" > /vault/env/.env
	echo "VAULT_TOKEN=$ROOT_TOKEN">> /vault/env/.env

	#enable database
	echo 'Enable database in Vault server...'
	vault secrets enable database

	#enable kv1
	echo 'Enable kv1 in Vault server...'
	vault secrets enable -path=secret kv-v1

	#store secret-key django in kv
	secret_key=$(source .env; echo $SECRET_KEY)
	vault kv put secret/secret-key value=$secret_key
fi

vault status > /vault/file/status;

wait "$pid"