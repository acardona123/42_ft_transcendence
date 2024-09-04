storage "file" {
	path = "/vault/file"
}

listener "tcp" {
	address     = "0.0.0.0:8200"
	tls_disable = 0
	tls_disable_client_certs = 1
	tls_cert_file = "/vault/tls/vault.crt"
	tls_key_file = "/vault/tls/vault.key"
}

ui = true
disable_mlock = true