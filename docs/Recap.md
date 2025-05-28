# Recap

!!! overview
    - Deploy locally first
    - Plan, configure, then run `kamal setup`
    - Ensure that your database is backed up, that your logs are searchable, that your application is being monitored, and that your application is secure.

This is a small book, but it covered a lot of ground, and quickly.

- First, we stressed the importance of deploying locally first. It is hard enough debugging why your application can't start in an unfamiliar environment; it is doubly as hard if you've never deployed your application at all.
- Then we covered all the ingredients you need to gather in order to successfully deploy (including some optional ingredients): an SSH key, a machine (dedicated or VPS), a domain name, a container registry, a password manager, and a builder.
- We updated `config/deploy.yml`, `.kamal/secrets`, `config/storage.yml`, `config/environments/production.rb`, and placed our secrets into a password manager.
- We ran `kamal setup`.
- We secured our deployment with an SSH key, a password manager, a firewall, and a plan to keep our application container and server updated.
- We installed and configured Litestream for continuous streaming backups, and used `rclone` for offsite backups.
- We installed `vector` to ship our logs, and covered a number of other monitoring tools.
- We optimized the processing of HTTP requests by adding Thruster to our deployment.
- We set up a staging environment.
- We set up continuous deployment with GitHub Actions.
- We converted from Sqlite3 to PostgreSQL.
- If we set up a second machine, we set up a load balancer and SSL certificate.

While the existing Kamal website, book, and videos are good at what they were created for, they understandably focus narrowly on the topic of Kamal, and less on the general topic of going to production. To do a complete job of deployment with Kamal, you need to be aware of how Docker works, and how servers work. To go to production, backups, logging, and monitoring are essential.

Along the way, we covered a number of things that aren't widely covered elsewhere:

- Assuming you've provisioned enough RAM and disk space, your target host machine can be used as a builder.
- Running other support services (for example: Vector, NATS) on your host.
- Using Kamal's proxy to run multiple applications on a single host.

I've documented a single path for deploying my application. There undoubtedly are many other paths. Having one path that is known to work should enable others to explore alternatives. Meanwhile, I'm confident with choices like Litestream, Vector, and NATS as these applications have been in production for years.
