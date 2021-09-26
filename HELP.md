## Migrations through the `typeorm` cli

First you have to enter the backend nestjs container with:

    docker exec -it nestjs_dev /bin/sh

---

### To generate migrations

    npm run typeorm migration:generate -- -n <name> [-o]

if `-o` is provided it will generate a `.js` file instead of a `.ts` thus making it easier to run them later

---

### To run migrations

based on [https://typeorm.io/#/migrations/running-and-reverting-migrations](https://typeorm.io/#/migrations/running-and-reverting-migrations) to run a `.ts` migration:

    NODE_ENV=development ts-node --transpile-only ./node_modules/typeorm/cli.js migration:run

to run a `.js` migration:

    npm run typeorm migration:run

## Create dockerfile for prod

[https://dev.to/erezhod/setting-up-a-nestjs-project-with-docker-for-back-end-development-30lg](https://dev.to/erezhod/setting-up-a-nestjs-project-with-docker-for-back-end-development-30lg)

### Run e2e tests inside container

    docker exec -it nestjs_dev /bin/sh
    npm run test:e2e
