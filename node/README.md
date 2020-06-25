# Menoum

### Development
**Environment variables**

Clone the file `.env.skeleton` to `dev.env` and fill the database information that you want.

**Starting the server with Docker**

The command `docker-compose up` will start the Node and Postgres servers with Adminer to manage your database data.

In another terminal, run all the migrations: `docker-compose exec api npm run migrate:latest`

The data from the database will persist even the container is not running.
If you ever need to completely erase the database and start over, run `docker-compose down -v` where `-v` tells Docker
to also delete the volumes. Then run `docker-compose up` to start over.

### List of commands
| Command | Information |
| -- | --- |
| `docker-compose exec api npm run migrate:make -- <your_migration_name>` | Creates a migration file located at **/database/migrations/**. |
| `docker-compose exec api npm run migrate:latest` | Runs all migrations that have not yet been run. |
| `docker-compose exec api npm run migrate:rollback (-- all)` | Rolls back the latest migration group or all if the parameter got specified. |
| `docker-compose exec api npm run migrate:up (-- <migration_name>)` | Runs the specified (by the parameter), or the next chronological migration that has not yet be run. |
| `docker-compose exec api npm run migrate:down (-- <migration_name>)` | Will undo the specified (by the parameter), or the last migration that was run. |
| `docker-compose exec api npm run migrate:list` | Will return list of completed and pending migrations |
