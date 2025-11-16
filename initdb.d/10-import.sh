#!/usr/bin/env bash
set -e
dir=`mktemp -d` 
tar xJC "$dir" < /docker-entrypoint-initdb.d/aml-hackathon.tar.xz
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE TABLE scored_transactions(
	id serial not null primary key,
	ts varchar(255) NOT NULL,
	from_bank varchar(255) NOT NULL,
	account varchar(255)NOT NULL,
	to_bank varchar(255)NOT NULL,
	account1 varchar(255)NOT NULL,
	amount_received numeric NULL,
	receiving_currency varchar(255)NOT NULL,
	amount_paid numeric not NULL,
	payment_currency varchar(255) NOT NULL,
	payment_format varchar(255) NOT NULL,
	is_laundering int NOT NULL,
	risk_level real NOT NULL,
	scoring varchar(255) not null
);
COPY scored_transactions (
	ts,
	from_bank ,
	account ,
	to_bank ,
	account1 ,
	amount_received ,
	receiving_currency ,
	amount_paid ,
	payment_currency ,
	payment_format ,
	is_laundering ,
	risk_level,
	scoring
)
FROM '$dir/aml-hackathon/scored_transactions.csv' WITH (FORMAT csv, HEADER true);
EOSQL
