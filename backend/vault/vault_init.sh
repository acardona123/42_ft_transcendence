#!/usr/bin/sh

if [ -s /vault/file/keys ]; then
	#unseal vault with 3 keys
	vault operator unseal $(grep 'Key 1:' /vault/file/keys | awk '{print $NF}');
	vault operator unseal $(grep 'Key 2:' /vault/file/keys | awk '{print $NF}');
	vault operator unseal $(grep 'Key 3:' /vault/file/keys | awk '{print $NF}');
else
	#init vault
	vault operator init > /vault/file/keys;

	#unseal vault with 3 keys
	vault operator unseal $(grep 'Key 1:' /vault/file/keys | awk '{print $NF}');
	vault operator unseal $(grep 'Key 2:' /vault/file/keys | awk '{print $NF}');
	vault operator unseal $(grep 'Key 3:' /vault/file/keys | awk '{print $NF}');

	#log in vault
	export ROOT_TOKEN=$(grep 'Initial Root Token:' /vault/file/keys | awk '{print $NF}');
	vault login $ROOT_TOKEN;

fi

vault status > /vault/file/status;
