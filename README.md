<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

A NestJs + TypeORM REST API Store with the basic expected features.

Running on Node v18.12.1

## Installation

```bash
$ npm install
```

or

```bash
$ yarn
```

## Setting the Envs

```bash
# DB
DB_NAME=
DB_PORT=
DB_HOST=
HOST_API=
DB_PASSWORD=
DB_USERNAME=

# Jwt
JWT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

or

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Endpoints

By default, the server runs on port 3000, so you can access from `localhost:3000/` using [Postman][1] or [Insomnia][2]

[1]: https://www.postman.com/
[2]: https://insomnia.rest/download

#### Auth

```bash
# checkAuth
GET    api/auth/checkAuth

# login
POST   api/auth/login

# create user
POST   api/auth/

# update user
PATCH  api/auth/:id

# reset user password
PATCH  api/auth/reset-password/:id

# delete
DELETE api/auth/:id
```

#### Categories

```bash
# findAll
GET    api/categories/

# findOne
GET    api/categories/:id

# create
POST   api/categories/

# update
PATCH  api/categories/:id

# delete
DELETE api/categories/:id
```

#### Products

```bash
# findAll
GET    api/products/

# findOne
GET    api/products/:id
GET    api/products/:slug

# create
POST   api/products/

# update
PATCH  api/products/:id

# delete
DELETE api/products/:id
```

#### Orders

```bash
# findAll
GET    api/orders/

# findOne
GET    api/orders/:id

# create
POST   api/orders/

# update
PATCH  api/orders/:id

# delete
DELETE api/orders/:id
```

#### Tags

```bash
# findAll
GET    api/tags/

# findOne
GET    api/tags/:id

# create
POST   api/tags/

# update
PATCH  api/tags/:id

# delete
DELETE api/tags/:id
```

#### Images

```bash
# findAll
GET    api/images/

# findOne
GET    api/images/:id

# create
POST   api/images/

# update
PATCH  api/images/:id

# delete
DELETE api/images/:id

# bulk delete
DELETE api/images/bulkDelete/:ids
# comma separated ids api/images/bulkDelete/5465464,4556754754,234324242
```

## Incomming Features

- Admin settings crud (contact data, payment info)

## Stay in touch

- Author - [Ubaldo Suarez](https://www.linkedin.com/in/usuarezs/)
- Website - [https://suarez.netlify.app](https://suarez.netlify.app)
