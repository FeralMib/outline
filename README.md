# Outline

![](https://circleci.com/gh/jorilallo/atlas.svg?style=shield&circle-token=c0c4c2f39990e277385d5c1ae96169c409eb887a)
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/outline)

An open, extensible, knowledge base for your team built using React and Node.js. Try Outline out using our hosted version at [www.getoutline.com](https://www.getoutline.com) or read on to learn about installing on your own infrastructure.

## Installation

Outline requires following dependencies to work:

- Postgres >=9.5
- Redis
- S3 bucket configured to support CORS uploads
- Slack developer application

To install and run the application:

 1. Install dependencies with `yarn`
 1. Register a Slack app at https://api.slack.com/apps
 1. Copy the file `.env.sample` to `.env` and fill out the keys
 1. Run DB migrations `yarn sequelize db:migrate`
 1. Start the development server `yarn start`


## Migrations

Sequelize is used to create and run migrations, for example:

```
yarn sequelize migration:create
yarn sequelize db:migrate
```

Or to run migrations on test database:

```
yarn sequelize db:migrate --env test
```


## License

Outline is [BSD licensed](/blob/master/LICENSE).
