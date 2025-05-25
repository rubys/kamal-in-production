# Plating Your Disk

!!! overview
    - Running `kamal setup` and `kamal deploy`

Congratulations! You have gathered all the ingredients necessary for your first deploy.
You have configured Kamal, and you have configured Active Storage.

With all this in place, your first deploy is as simple as:

```sh
$ bin/kamal setup
```

Messages will scroll by as commands are executed, which can be useful for spotting any problems.

What this command does:

- Installs Docker on your host
- Builds your image
- Pushes your image to your registry
- Pulls your image onto your host
- Starts your container, passing in your secrets
- Runs your migrations and seeds your database
- Waits for your health check to pass
- Configures your proxy to forward requests to your container
- Sets up your SSL certificate

Shortly after this command completes, you should be able to visit your website at the domain you specified in your `config/deploy.yml`.
Note that if you visit too soon, you may see what is intentionally a scary SSL certificate error from your browser. It takes a minute or two for the certificate to be issued, and the browser will not trust your site until it is.

Subsequent deploys can be done via:

```sh
$ bin/kamal deploy
```

Once you put an application into production, you need to take care of a few chores to keep the application running smoothly. These chores aren't automatically taken care of for you, but luckily, you can automate them.