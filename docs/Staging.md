# Staging

!!! overview
    - Setting up a subdomain
    - Creating a staging configuration file
    - Sharing secrets between environments
    - Setting resource limits

At this point you should be feeling pretty good about your setup. Your application is monitored, backed up, and secured. There is one last thing that might be worth considering before you make your server available to others. Deploying directly from your development machine to production may not always be the smartest approach.

It may be worth creating a *staging* environment for testing and validation purposes. A staging environment is a replica of your production environment where you can test new features, updates, and configurations before deploying them to production. This helps in identifying and fixing issues in a controlled setting, ensuring that the production environment remains stable and reliable.

Kamal makes this easy. You can put the staging environment on the same server as your production environment, or on a different server. You can even use a different cloud provider if you want. You can share secrets, or not. You can share the same database, or not. In each case, the choice is yours.

Start by going into your DNS provider's dashboard. Select your domain, and add a new subdomain by going into the DNS records, and adding another **A** record. Call it `staging`. Provide the IP address of the server you want this application to run on. This can be the same address as your production server. Once again, if you are using CloudFlare, disable the orange cloud so that the subdomain is not proxied.

Next, create a file named `config/deploy.staging.yml` in your project directory. This file will contain the configuration for deploying to the staging environment. Here is an example configuration file:

```yaml
proxy:
  ssl: true
  host: staging.example.com
```

Then rename `.kamal/secrets` to `.kamal/secrets-common`. This will allow you to share secrets between the staging and production environments. Adjust your `.gitignore` and `.dockerignore` files as needed.

Finally, deploy your application to the staging environment by running the following command:

```sh
kamal deploy -d staging
```

You can now access your application by visiting `https://staging.example.com`. This copy of the application is sharing the same database, and the same object storage as the production environment. You can test new features, updates, and configurations in a controlled setting before deploying them to production. Your logs will be integrated. Your database changes will be backed up.

If you want to have a separate database for the staging environment, copy the `volume` section from the `.kamal/deploy.yml` file to the `.kamal/deploy.staging.yml` file, and adjust the directory name as needed. The next time you deploy to the staging environment, a new database will be created for you and seeded. It is up to you if you want to back up the staging database.

Configuration files for destinations are merged with the base configuration,
[see the docs](https://kamal-deploy.org/docs/configuration/overview/#destinations),
so you can override any settings as needed. If your staging environment is on a different server, you can specify the IP address in the `web:` field of the `servers:` section.

So far we've been adding a number of applications to the same server. It may be time to limit how much each application can use. This is done by setting resource limits. You can set limits on the amount of CPU and memory that each application can use. This is done by adding an `options:` section
[see the docs](https://kamal-deploy.org/docs/configuration/roles/#custom-role-configuration)
to the `.kamal/deploy.*.yml` file. See the documentation for [Docker Resource Constraints](https://docs.docker.com/config/containers/resource_constraints/) for more information.

Secrets are handled differently. If you are using destinations, secrets will be read from `.kamal/secrets` first or `.kamal/secrets-common` if it is not found.
[More info](https://kamal-deploy.org/docs/upgrading/secrets-changes/)
Of course, multiple secrets files can reference the same password manager.
