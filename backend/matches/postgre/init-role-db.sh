#!/bin/bash
set -e

	# ALTER DATABASE "$POSTGRES_DB" OWNER TO "$POSTGRES_USER";
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE ROLE "$POSTGRES_ROLE" NOINHERIT CREATEROLE;
	GRANT ALL ON SCHEMA public TO "$POSTGRES_ROLE";
	GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO "$POSTGRES_ROLE";

EOSQL