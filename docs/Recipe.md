# Step 1: Configure Kamal

!!! overview
    - configure `config/deploy.yml`

You've gathered your ingredients; now it's time to start cooking. Much of the data you have gathered gets deposited into two files.

If you are using Rails 8, you already have Kamal installed. If not, you can install it with `gem install kamal`.
[Installation instructions](https://kamal-deploy.org/docs/installation/)
Once installed, you can create your configuration files by running `kamal init`.

First up: `config/deploy.yml`. Note that there will be minor differences in the initial content of this file depending on whether you created it using `kamal init` or `rails new`, as Rails will pre-fill a number of these fields.

Kamal provides full documentation on this file.
[Configuration Overview](https://kamal-deploy.org/docs/configuration/overview/)
The fields you will be updating are highlighted below:

```yaml title="config/deploy.yml" hl_lines="2 5 10 24 32 42-44 57-64 72-76 85-86 88-93" linenums="1"
# Name of your application. Used to uniquely configure containers.
service: depot # (1)!

# Name of the container image.
image: samruby/depot # (2)!

# Deploy to these servers.
servers:
  web:
    - 192.168.0.1 #(3)!
  # job:
  #   hosts:
  #     - 192.168.0.1
  #   cmd: bin/jobs

# Enable SSL auto certification via Let's Encrypt and allow for multiple apps
# on a single web server. Remove this section when using multiple web servers
# and ensure you terminate SSL at your load balancer.
#
# Note: If using Cloudflare, set encryption mode in SSL/TLS settings to "Full"
# to enable CF-to-app encryption.
proxy:
  ssl: true
  host: depot.example.com # (5)!
  # Proxy connects to your container on port 80 by default.
  # app_port: 3000

# Credentials for your image host.
registry:
  # Specify the registry server, if you're not using Docker Hub
  # server: registry.digitalocean.com / ghcr.io / ...
  username: samruby # (6)!

  # Always use an access token rather than a real password (pulled from
  # .kamal/secrets).
  password:
    - KAMAL_REGISTRY_PASSWORD

# Configure builder setup.
builder:
  arch: amd64
  context: . # (7)!
  remote: ssh://root@192.168.0.1 # (4)!
  local: false # (8)!
  # Pass in additional build args needed for your Dockerfile.
  # args:
  #   RUBY_VERSION: <%= ENV["RBENV_VERSION"] || ENV["rvm_ruby_string"] ||
  #     "#{RUBY_ENGINE}-#{RUBY_ENGINE_VERSION}" %>

# Inject ENV variables into containers (secrets come from .kamal/secrets).
#
# env:
#   clear:
#     DB_HOST: 192.168.0.2
#   secret:
#     - RAILS_MASTER_KEY
env:
  secret: # (9)!
    - RAILS_MASTER_KEY
    - ACCESS_KEY_ID
    - SECRET_ACCESS_KEY
    - ENDPOINT_URL
    - REGION
    - BUCKET_NAME

# Aliases are triggered with "bin/kamal <alias>". You can overwrite arguments
# on invocation: "bin/kamal app logs -r job" will tail logs from the first
# server in the job section.
#
# aliases:
#   shell: app exec --interactive --reuse "bash"
aliases: # (10)!
  console: app exec --interactive --reuse "bin/rails console"
  shell: app exec --interactive --reuse "bash"
  logs: app logs -f
  dbc: app exec --interactive --reuse "bin/rails dbconsole"

# Use a different ssh user than root
#
# ssh:
#   user: app

# Use a persistent storage volume.
#
volumes: # (11)!
  - "depot_storage:/rails/storage"

# Configure logging
logging: # (12)!
  driver: local
  options:
    max-size: 20m
    max-file: 5

# Bridge fingerprinted assets, like JS and CSS, between versions to avoid
# hitting 404 on in-flight requests. Combines all files from new and old
# version inside the asset_path.
#
# asset_path: /app/public/assets

# Configure rolling deploys by setting a wait time between batches of restarts.
#
# boot:
#   limit: 10 # Can also specify as a percentage of total hosts, such as "25%"
#   wait: 2

# Use accessory services (secrets come from .kamal/secrets).
#
# accessories:
#   db:
#     image: mysql:8.0
#     host: 192.168.0.2
#     port: 3306
#     env:
#       clear:
#         MYSQL_ROOT_HOST: '%'
#       secret:
#         - MYSQL_ROOT_PASSWORD
#     files:
#       - config/mysql/production.cnf:/etc/mysql/my.cnf
#       - db/production.sql:/docker-entrypoint-initdb.d/setup.sql
#     directories:
#       - data:/var/lib/mysql
#   redis:
#     image: valkey/valkey:8
#     host: 192.168.0.2
#     port: 6379
#     directories:
#       - data:/data
```

1. **service** is the container name prefix. Use whatever you want here.
2. **image** the desired name of the image in the docker registry. Built images will be pushed to this name, and Kamal will pull this named image to the target host(s) upon deploy.
3. You put the IP address of your host in this file twice: once as the deployment target, and once as your builder.
4. You also put the IP address of your host here.
5. You put your domain name in the proxy section; HTTPS certificates will be provided for you using
  [Let's Encrypt](https://letsencrypt.org/).
6. In the registry section, you select your container registry server, which defaults to Docker Hub. You then provide the username and password needed to access that container registry server. The password secret should always be an access token provided by `.kamal/secrets`.
7. The default for building is to use your last git commit. Initially, it is sometimes easier to deploy the files as they exist on your development machine until things are working; that's what `context: .` does. This does mean that at times you will deploy changes and not commit them; for this reason, it is recommended that you delete this line once you are comfortable with your setup.
8. The remainder of the builder section specifies to do remote builds on your deployment machine. If you have a separate builder, you can specify that here.
9. In the secret section, you list your S3 secrets. Alternatively, they can be placed in your
  [credentials file](https://guides.rubyonrails.org/security.html#custom-credentials-url).
  Some of these values (examples: `ENDPOINT_ID`, `REGION`, and `BUCKET_NAME`) could be passed in the clear instead.
10. While not related to data you've captured, [aliases](https://kamal-deploy.org/docs/configuration/aliases/) are useful for commands that you are likely to repeat.
11. Uncomment these lines. Volume is used to retain your data across deployments: it maps a directory in your container to a directory on your host machine. We're not changing it, but note the recommendation in the comment above it to back this directory up off-server is very important.
12. For logging, you can keep the default (`json-file`), or go with Docker's recommendation (`local`).
  [Docker Logging Configuration](https://docs.docker.com/engine/logging/configure/)
  Either way, you likely will want to adjust `max-size` and/or `max-file`.

While this was a fair amount of configuration, the prep work you did before you got to this point made it quick work.

For the most part, this configuration is a set-and-forget operation. It is rare that you will need to update this file again.
