# Deploying Your App Locally

!!! overview
    - Running Docker compose

The first step is both obvious and often overlooked: deploy your application first locally before trying to deploy it on another server.

Consider a simple Rails application. For example, this one from Agile Web Development with Rails:

```sh
rails new depot --css tailwind

cd depot

bin/rails generate scaffold Product \
  title:string description:text image:attachment price:decimal

bin/rails active_storage:install

bin/rails db:migrate
```

Now create a file named `docker-compose.yml` and place within it the following:

```yaml
services:
  web:
    build: .
    volumes:
      - ./log:/rails/log
      - ./storage:/rails/storage
    ports:
      - "3000:3000"
    secrets:
      - source: master_key
        target: /rails/config/master.key

secrets:
  master_key:
    file: ./config/master.key
```

Install Docker
[https://docs.docker.com/desktop/](https://docs.docker.com/desktop/)
and then run:

```sh
$ docker compose up
```

After about a minute, your app will be running in production on your personal laptop or desktop. You can access it via [http://localhost:3000/posts](http://localhost:3000/posts).
Your `log` and `storage` will be read and written to by the container, but nothing else on your machine will be accessible.

You can even run commands in your container:

```sh
$ docker compose exec web bin/rails console
```

The importance of this first step can't be overstated. Your first deploy with a real application will likely fail. In a not insignificant number of cases one of the contributing causes is that this is the first time your application is run in production and your Dockerfile is not set up correctly or your seed data is incomplete, or some secret needs to be set.

Rails will provide you with a `Dockerfile` when you create your application, but your application may have changed since then.

It even is possible that the Rails provided Dockerfile never worked in the first place. As an example, starting on February 14th, 2025, Ruby docker images [no longer included the `libyaml-dev` module](https://github.com/docker-library/ruby/pull/493).
This broke the Rails provided Dockerfile. The [fix](https://github.com/rails/rails/pull/54237)) was straightforward
and merged into Rails source on January 14th. Unfortunately this fix was not included in a release until Rails [8.0.2](https://rubygems.org/gems/rails/versions/8.0.2) on March 12th, 2025. So for nearly a month the Dockerfile produced by the latest released Rails version did not work with the latest released Ruby version. At the time of this writing, new projects created by previous versions of Rails still produce Dockerfiles that don't work.

Fly.io provides a [dockerfile-rails](https://github.com/fly-apps/dockerfile-rails?tab=readme-ov-file#overview)
generator that can examine your code and provide you with a new `Dockerfile` that matches your application.

Other frameworks may not provide you with a Dockerfile to get started with. Fly.io provides dockerfile generators for
[Django](https://github.com/fly-apps/dockerfile-django?tab=readme-ov-file#dockerfile-generator-for-django-projects),
[Laravel](https://github.com/fly-apps/dockerfile-laravel?tab=readme-ov-file#dockerfile-laravel) and
[Node](https://github.com/fly-apps/dockerfile-node?tab=readme-ov-file#overview)
You do not need to be using Fly.io to use these generators.

This `docker-compose.yml` file is a good starting point for most applications.
Applications that have external dependencies may require more setup. See examples for [PostgreSQL](https://github.com/fly-apps/dockerfile-rails/blob/main/test/results/postgresql/docker-compose.yml)
and [Redis](https://github.com/fly-apps/dockerfile-rails/blob/main/test/results/redis/docker-compose.yml).

Visit the [Docker Documentation](https://docs.docker.com/compose/)
for more information on `docker compose`.