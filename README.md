# Waves data service API

**⚠️ This service is currently in /v0. Breaking changes are coming in /v1 (also possible, but not likely, within /v0 releases). Please use with caution.**

This is an API aimed at retrieving data from blockchain quickly and conveniently. We  support public APIs for:
- Mainnet
  - [https://api.wavesplatform.com/v0/](https://api.wavesplatform.com/v0/)
- Testnet
  - [https://api.testnet.wavesplatform.com/v0/](https://api.testnet.wavesplatform.com/v0/)

Visit `/docs` for Swagger documentation.


## Data service on-premise

It is possible to create your own instance of this service. To do so, follow the guide below.

#### Requirements

1. PostgreSQL 11 database with a table stricture found in [wavesplatform/blockchain-postgres-sync](https://github.com/wavesplatform/blockchain-postgres-sync)
2. Downloaded and continuously updated blockchain data in the database
2. NodeJS or Docker for either running the service directly, or in a container

#### Installation and start

The service uses following environment variables:

|Env variable|Default|Required|Description|
|------------|-------|--------|-----------|
|`PORT`|3000|NO|HTTP service port|
|`PGHOST`||YES|Postgres host address|
|`PGPORT`|`5432`|NO|Postgres port|
|`PGDATABASE`||YES|Postgres database name|
|`PGUSER`||YES|Postgres user name|
|`PGPASSWORD`||YES|Postgres password|
|`PGPOOLSIZE`|`20`|NO|Postgres pool size|
|`LOG_LEVEL`|`info`|NO|Log level `['info','warn','error']`|
|`DEFAULT_MATCHER`||YES|Default matcher public address|
|`MATCHER_SETTINGS_URL`|https://matcher.wavesplatform.com/matcher/settings|NO|Default matcher URL for getting settings|

`PGPOOLSIZE` is used by the `pg-pool` library to determine Postgres connection pool size per NodeJS process instance. A good value depends on your server and db configuration and can be found empirically. You can leave it at the default value to start with.

Set those variables to a `variables.env` file in the root of the project for convenience. In the next steps we will assume this file exists.

If you would like to use some other way of setting environment variables, just replace relevant commands below with custom alternatives.

##### Docker
1. Build a Docker image from the project root
   ```bash
   docker build -t wavesplatform/data-service .
   ```
2. Run the container
   ```bash
   docker run -p=<port>:3000 --env-file=variables.env wavesplatform/data-service
   ```

A server will start at `localhost:<port>` (used in the `docker run` command). Logs will be handled by Docker. Use any other Docker options if necessary.

When using the container in production, we recommend establishing a Docker logging and restart policy.

##### NodeJS
1. Install dependencies
   ```bash
   npm install    # or `yarn install`, if you prefer
   ```
2. Start the server
   ```bash
   export $(cat variables.env | xargs) && NODE_ENV=production node src/index.js
   ```

Server will start at `localhost:PORT` (defaults to 3000). Logs will be directed to stdout.

If you decide to use NodeJS directly (without Docker), we recommend using a process manager, such as `pm2`.


#### Daemons
To add candles and pairs functionality the following Docker daemons must be used:
- Candles — calculate candles for exchange transactions (see [description](https://hub.docker.com/r/wavesplatform/data-service-candles/))
- Pairs — calculate last pairs for 24h exchange transactions (see [description](https://hub.docker.com/r/wavesplatform/data-service-pairs/))


#### Documentation
You can run your own instance of Swagger online documentation.
To do this, you have to:
1. Build Docker image from docs/ directory:
    ```bash
    docker build -t wavesplatform/data-service-docs docs/
    ```
2. Run the container
    ```bash
    docker run --rm -d -p 8080:8080 -e SWAGGER_JSON=/app/openapi.json wavesplatform/data-service-docs
    ```

Its will start the documentation server at `localhost:8080`. Enjoy!

#### General recommendations
- Set up a dedicated web server such as Nginx in front of data-service backends (for ssl/caching/balancing)
- Implement a caching strategy. Different endpoints may need different cache time (or no cache at all)
- Run several process instances behind a load balancer per machine. `docker-compose --scale` can help with that, or it can be done manually. A good rule of thumb is to use as many instances as CPU cores available.
- Use several machines in different data centers and a balancer to minimize downtime
- Experiment with PostgreSQL settings to find out what works best for your configuration. Tweaking `PGPOOLSIZE` also can help performance.
