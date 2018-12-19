# Data Service Candles Daemon in Docker

## About the image
This Docker image contains scripts and configs to run Data Service Candles Daemon. The image adds functionality to [Data Service](https://github.com/wavesplatform/data-service) to calculate and update DEX candles inside the Postgres database (see Requirements).

Container downloads source code and configuration files from the [repository](https://github.com/wavesplatform/data-service) and runs it.  
 
## Requirements ⚠️

1. PostgreSQL 10 database with a table structure found in [wavesplatform/blockchain-postgres-sync](https://github.com/wavesplatform/blockchain-postgres-sync)
2. Downloaded and continuously updated blockchain data in the database
2. Docker for running the service in a container

## Running the image

The simplest way to run a container:
```
docker run -e PGHOST=*** -e PGDATABASE=*** -e PGUSER=*** -e PGPASSWORD=*** -it wavesplatform/candles-daemon
```

**You can run container with environment variables:**

|Env variable|Default|Required|Description|
|------------|-------|--------|-----------|
|`PGHOST`||YES|Postgres host address|
|`PGPORT`|`5432`|NO|Postgres port|
|`PGDATABASE`||YES|Postgres database name|
|`PGUSER`||YES|Postgres user name|
|`PGPASSWORD`||YES|Postgres password|
|`PGPOOLSIZE`|`20`|NO|Postgres pool size|
|`LOG_LEVEL`|`info`|NO|Log level `['info','warn','error']`|
|`CANDLES_UPDATE_INTERVAL_`|`2500`|NO|Minimum daemon update time in ms. If time is exceeded, the next iteration starts immediately|
|`CANDLES_UPDATE_TIMEOUT`|`20000`|NO|If the update time in ms is exceeded, the daemon terminates|
|`RECALCULATE_ALL_CANDLES_ON_START`|`true`|NO|Truncate all data from candles table and recalculate all candles|

`PGPOOLSIZE` is used by the `pg-pool` library to determine Postgres connection pool size per NodeJS process instance. A good value depends on your server and db configuration and can be found empirically. You can leave it at the default value to start with.
