# Plating Your Disk

!!! overview
    - Running `kamal setup` and `kamal deploy`

Congratulations! You have gathered all the ingredients necessary for your first deploy.
You have configured Kamal, and you have configured Active Storage.
And (if necessary) you have added Thruster to your deployment.

With all this in place, your first deploy is as simple as:

```sh
$ bin/kamal setup
```

Messages will scroll by as commands are executed, and can be useful to help you spot any problems.

What this command did was:

- Install Docker on your host
- Build your image
- Push your image to your registry
- Pull your image onto your host
- Start your container, passing in your secrets
- Run your migrations and seed your database
- Wait for your health check to pass
- Configure your proxy to forward requests to your container
- Set up your SSL certificate

Shortly after this command completes you should be able to visit your website at the domain you specified in your `config/deploy.yml`.
Note that if you visit too soon you may see what intentionally is a scary SSL certificate error from your browser. It takes a minute or two for the certificate to be issued, and the browser will not trust your site until it is.

Subsequent deploys can be done via:

```sh
$ bin/kamal deploy
```

Once we put an application into production, we need to take care of a few chores to keep the application running smoothly. These chores aren't automatically taken care of for us, but luckily we can automate them.