# Horizontal Scaling

!!! overview
    - Converting from Sqlite3 to PostgreSQL
    - Other requirements: Load Balancer, SSL Certificate
    - Optimizing for PostgreSQL

As your needs increase, you can move to bigger and bigger servers.
[Source](https://x.com/dhh/status/1799107964412056012)
At some point, you may need more, or simply want resiliency, or perhaps want to serve requests closer to your users.

Sqlite3 is a wonderful database, and the Rails team invested a lot of effort into making Sqlite ready for production with Rails 8. You can read (or watch) more in Stephen Margheim's talk: Supercharge the One Person Framework with SQLite: Rails World 2024.
[Read more](https://fractaledmind.github.io/2024/10/16/sqlite-supercharges-rails/)
A quote from that presentation:

> The next detail to be considerate of is that SQLite is built to work best on a single machine.

This generally means that when you are ready to make the move from a single server to multiple machines, you will need to convert from Sqlite3 to a database like PostgreSQL or MySQL. For this, unless you are the type to change your own oil in your vehicles, you will want a *managed* database solution. Some of the things a managed database will take care of for you:

- Provisioning the right cluster configuration for you
- Scaling storage and memory resources
- Upgrading Postgres versions and security patches
- Developing a database backup and restoration plan
- Monitoring and alerts
- Recovering from outages
- Global replication
- Configuration tuning
- Advanced customization

A few providers to choose from:

- [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/)
- [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/products/postgresql/#overview)
- [Crunchy Bridge Managed Postgres](https://www.crunchydata.com/products/crunchy-bridge)
- [Digital Ocean Managed Postgres](https://www.digitalocean.com/products/managed-databases-postgresql)
- [Fly.io Managed Postgres](https://fly.io/docs/mpg/overview/)
- [Google Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres/)
- [Heroku Managed Data Services](https://www.heroku.com/managed-data-services)
- [Neon Serverless Postgres](https://neon.tech/)
- [PlanetScale Serverless MySQL](https://planetscale.com/)
- [Supabase Postgres](https://supabase.com/)

Following are instructions for converting to PostgreSQL, a popular and widely supported open source database.

- Install the `pg` gem with the `bundle add pg` command. This generally requires you to have first installed PostgreSQL on your development machine, even if you aren't going to use PostgreSQL in development.
  MacOS users may want to use `brew install postgresql@17`, Debian users will want `sudo apt install postgresql`.
- In your `Dockerfile`, replace `sqlite3` with `libpq-dev postgresql-client`.
  Again, you can use [dockerfile-rails](https://github.com/fly-apps/dockerfile-rails?tab=readme-ov-file#overview) to take care of this chore for you.
- The [Active Record guides](https://guides.rubyonrails.org/v5.0/configuring.html#configuring-a-postgresql-database) recommend updating `config/database.yml`, but it is generally easier to set a `DATABASE_URL` secret.
  [More info](https://guides.rubyonrails.org/v5.0/configuring.html#configuring-a-database)
  If you would prefer to follow the recommendation, Rails provides `rails db:system:change --to=postgresql`, which can make the necessary changes for you, but be aware that this will convert your application to using PostgreSQL not only in production, but also in development.

There is a tool named [pgloader](https://github.com/dimitri/pgloader?tab=readme-ov-file#pgloader) which you can use to copy your Sqlite3 database to PostgreSQL.

Once you define a second application machine, you will need to add a load balancer to route requests between machines. This is generally a paid feature.
[Hetzner Load Balancer](https://www.hetzner.com/cloud/load-balancer/)
You will also need an [SSL certificate](https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/) for your load balancer, as Kamal's [SSL support](https://kamal-deploy.org/docs/configuration/proxy/#ssl) is only for one server.

As PostgreSQL requests tend to have a higher latency per request than Sqlite3, you will likely need to tune your application. Look for places where you execute a query and iterate over the results, and inside the iteration you traverse over relationships—this will generally require multiple queries. You can avoid this using [includes](https://apidock.com/rails/ActiveRecord/QueryMethods/includes), [preloads](https://apidock.com/rails/v5.2.3/ActiveRecord/QueryMethods/preload), or [eager_load](https://apidock.com/rails/v5.2.3/ActiveRecord/QueryMethods/eager_load).
