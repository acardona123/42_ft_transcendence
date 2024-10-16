FROM hashicorp/vault:1.17

RUN apk --no-cache add curl jq

COPY --chown=vault:vault ./config.hcl /vault/config/config.hcl

RUN mkdir -p /vault/tls; chown vault:vault /vault/tls;

RUN apk --no-cache add openssl;\
	openssl req -out /vault/tls/vault.crt -new -keyout /vault/tls/vault.key\
	-newkey rsa:2048 -nodes -sha256 -x509 -subj "/O=HashiCorp/CN=Vault"\
	-addext "subjectAltName = IP:0.0.0.0,DNS:vault" -days 365;\
	chown vault:vault /vault/tls/*;

COPY --chown=vault:vault ./.env /.env