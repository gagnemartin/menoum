# Menoum

### Technologies
This application uses these technologies:
- [Adminer](https://www.adminer.org/) to view and manage the database
- [Docker](https://docs.docker.com/compose/) to run the application
- [Elasticsearch](https://www.elastic.co/) as a search engine
- [Express.js](https://expressjs.com/) as a Node.js framework
- [React](https://reactjs.org/) as a frontend framework
- [Kibana](https://www.elastic.co/kibana) to visualize Elasticsearch's data
- [Knex.js](http://knexjs.org/) to communicate with the database
- [Node.js](https://nodejs.org/) as a backend server
- [PostgreSQL](https://www.postgresql.org/) as a database system

---

### Development

#### Environment variables

Clone the file `.env.skeleton` to `.env` and fill the database information that you want.

#### Starting the server with Docker

The command `npm start` will start the React, Node and Postgres servers with Adminer to manage your database data. Elasticsearch will also launch with Kibana to visualize your data. The migrations will automatically run.

To also run the crawler, use the command `npm start:crawler`

In another terminal, run the seeders: `npm run seeds`

The data from the database will persist even the container is not running.
If you ever need to completely erase the database and start over, run `npm run init`. This will remove everything, start over and force build the Docker images.

The application will be visible at [https://localhost:3000/](https://localhost:3000/).

#### Adminer
To view and manage the Postgres database, navigate to [http://localhost:8080/](http://localhost:8080/) and login with the database information from the **dev.env** file. Select **PostgreSQL** as the System. The Server input is the database's Docker container name, which is simply **database**.

#### Elasticsearch
To view and manage the Elasticsearch database, navigate to [http://localhost:5601/](http://localhost:5601/)

**Windows users**

Windows users using wsl subsystem might get this error when running the app with docker

`Max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]`

Open powershell and run the following commands

1. `wsl -d docker-desktop`
2. `sysctl -w vm.max_map_count=262144`
3. `exit`

#### .cjs files

This application uses `"type": "module"` inside its package.json file to enable ES6 with Node.js and use import/export statements. However, some modules are importing files using the `require` statement and Node.js does not like that unless the imported Javascript file has a **.cjs** extension.

---

### List of commands

*To run these commands within the Docker container, add the following before every command: `docker-compose exec api <rest of the command>`*

**Migrations**

| Command | Information |
| --- | --- |
| `npm run migrate:make -- <your_migration_name>` | Creates a migration file located at **/database/migrations/**. |
| `npm run migrate:latest` | Runs all migrations that have not yet been run. |
| `npm run migrate:rollback (-- all)` | Rolls back the latest migration group or all if the parameter got specified. |
| `npm run migrate:up (-- <migration_name>)` | Runs the specified (by the parameter), or the next chronological migration that has not yet be run. |
| `npm run migrate:down (-- <migration_name>)` | Will undo the specified (by the parameter), or the last migration that was run. |
| `npm run migrate:list` | Will return list of completed and pending migrations |

**Seeders**

| Command | Information |
| --- | --- |
| `npm run seed:make -- <seed_name>` | Creates a new seed file located at **/database/seeders/**. |
| `npm run seed:run` | Runs all seed files for the current environment. |
