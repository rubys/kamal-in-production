# Assemble Your Ingredients

!!! overview
    - Obtain an SSH key
    - Acquire a Machine
    - Add Object Storage
    - Purchase a Domain Name
    - Select a Container Registry
    - Use a Password Manager
    - Set up a Builder

Deploying to production is not hard at all; it's just a number of small steps. These steps will go quicker if you do them in the correct order, and if you start with a code base that you have deployed locally first.
But first, let's review what resources are available:

- [kamal-deploy.org](https://kamal-deploy.org/) contains a 32 minute video demonstrating the creation and deployment of a simple application to a Hetzner server.
- [Kamal docs](https://kamal-deploy.org/docs/) contains some reference material that may be useful.
- [Kamal Handbook - The Missing Manual](https://kamalmanual.com/handbook/) is a short and practical book, and at the time of this writing is the only book on the subject.

What follows is neither a video nor a manual, but rather a recipe. And like most recipes, it starts with assembling your ingredients. Along the way, we'll share some general ideas of what prices you can expect to pay for each.
We'll also list a number of popular choices. These lists are neither endorsements nor meant to be exhaustive.

We are going to start with a single server, running Sqlite3. In [Scaling](Scaling.md) we'll outline the steps you need to take to scale to multiple machines, running PostgreSQL or another database.

While in theory you can assemble ingredients in any order, things might go faster if you do them in the order shown.

---

## SSH Key

SSH keys are used to authenticate you to a server. You can think of them as a password that you don't have to remember.

You probably already have one, but if not, create one. GitHub has some good docs on the subject:
[Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
There are a number of different types of keys you can generate. Unless you have a reason to go with a different type, adopt GitHub's recommendation and request a `ed25519` key:

```sh
$ ssh-keygen -t ed25519 -C "your_email@example.com"
```

SSH Keys are free.

---

## Server

A server is a computer that you can access over the internet. You can think of it as a computer that you rent by the month (and in some cases, by the hour).
You can also time share a machine with others by requesting a Virtual Private Server (VPS).

Most Kamal demos start with [Hetzner](https://www.hetzner.com/).
[Digital Ocean posts a list of alternatives.](https://www.digitalocean.com/resources/articles/hetzner-alternatives)

For demo/hobby purposes head to Hetzner Cloud. You can get a VPS starting at €3.79/month. Such a machine could handle up to around 20 requests per second. (1)
Note that while a small VPS is sufficient for running a small application, this book describes how you can run multiple applications, a staging environment, and even a build server on a single host.
For that, you will need more RAM, and possibly more persistent storage than you will get with the smallest available VPS.
{ .annotate }

1. Source: [How (and why) to run SQLite in production: RubyConf Taiwan 2023](https://fractaledmind.github.io/2023/12/23/rubyconftw/)

For production purposes head to Hetzner Robot and consider a dedicated machine. For €39.00/month you get 14 cores, 64GB RAM, 1TB NVMe, and unlimited bandwidth across a 1GB/s port. There is a setup fee of €39.00 required.
Such a machine should be able to process hundreds, and possibly even a small number of thousands, of requests per second. (1)
{ .annotate }

1. Source: [SQLite Myths: Linear writes don't scale ](https://fractaledmind.github.io/2023/12/05/sqlite-myths-linear-writes-do-not-scale/)

Sign up, provide your public ssh key, select the latest LTS version of Ubuntu (24.04). As a first time customer, this process will take about fifteen minutes, and you will end up with an IPv4 address. Once you are an established customer, this will go quicker.

Before proceeding, set up a firewall to only allow ports 22, 80, and 443 access.  For robot, click on the Firewall tab, select the WebServer template, and click Apply and Save.

See screenshots: [Hetzner Cloud](Assemble/Hetzner/Cloud.md), [Hetzner Robot](Assemble/Hetzner/Robot.md)

---

## Object Storage

To deploy the example described in [Local](Local.md), you will also want Object Storage, which starts at €5/month for a TB, plus €1/month for each TB of bandwidth. While you can add this later, it is needed to store your product images.
Note: while there are free quotas, be aware that you are charged for every hour you have at least one Bucket, even if it's empty.

It is also possible to run your own Object Storage services using [Minio](https://min.io/). If you go that route it is best if that were run on a separate server for disaster recovery reasons.

---

## Domain Name

A domain name is a human readable name that points to an IP address. This is what your users will put in the URL bar of their browser.

[CloudFlare](https://www.cloudflare.com/products/registrar/) is a domain registrar that prices domains at or close to cost and has other benefits.
[Shopify posts a list of alternatives.](https://www.shopify.com/blog/best-domain-registrars#)

After any initial teaser rates, plan to spend $10 to $25 a year for a domain name (vanity names can be considerably more).

Once you have obtained your domain name, go into the DNS settings, create an **A** record, with your IP address as the content.
If you are using CloudFlare, disable the "orange cloud" by clicking on the "Proxied" setting for now - if needed you can add that back later.

---

## Container Registry

Kamal works by building a Docker image and pushing it to a registry, and then pulling that image onto your deployment machines.

[DockerHub](https://hub.docker.com/) is effectively the default container registry, and can range from free to $24/user/month.
[quay.io](https://quay.io/),
[gcr.io](https://cloud.google.com/artifact-registry/docs),
[public.ecr.aws](https://gallery.ecr.aws/),
[ghcr.io](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry), and
[Gitlab](https://docs.gitlab.com/ee/user/packages/container_registry/)
are alternatives. You can also use [CNCF's Distribution Registry](https://distribution.github.io/distribution/) to self host a registry.

Realistically, you can get a container registry for a small number of personal projects for free.

When done you will end up with a rather opaque registry password that you will need later.

---

## Password Manager (optional but highly recommended)

A password manager is a tool that stores your passwords in an encrypted form. If you are working as a team, a password manager can be used to share secrets.

Password managers supported by Kamal are [1Password](https://1password.com/),
[LastPass](https://www.lastpass.com/),
[Bitwarden](https://bitwarden.com/),
[AWS Secrets Manager](https://aws.amazon.com/secrets-manager/),
and [Doppler](https://www.doppler.com/).
Figure $2 to $10 per user per month, unless you decide to self host, which is an option with [Bitwarden](https://bitwarden.com/help/self-host-an-organization/).

Not recommended, but you can directly put your passwords into `.kamal/secrets`, just be sure to add this file to your `.gitignore` and `.dockerignore` files.

---

## Builder (optional but recommended)

Kamal can use Docker to build your images locally, but there are at least two good reasons why you wouldn't want to do so:

- If you are developing on ARM64 (like Apple Silicon), but you want to deploy on AMD64 (x86 64-bit), the build can be [quite slow](https://kamal-deploy.org/docs/configuration/builder-examples/#using-remote-builder-for-single-arch)) and [buggy](https://github.com/docker/for-mac/issues/5342#issuecomment-779133157).
- If you have an asymmetric network connection (where downloads are faster than uploads), you may benefit from a configuration where you only upload your changed source to another server, and that server is responsible for uploading the considerably larger resulting Docker image.

A builder is simply a host that you have SSH access to and that is running Docker—preferably using the target instruction set architecture. You already have exactly that. Installing Docker on the host that you will be running your application is something Kamal does for you anyway. And that host can run multiple containers, and will obviously be running using the same instruction set architecture as your application. You just need to make sure that the host has enough storage and memory capacity to run both builds and your application. A ballpark of 8GB of RAM and 20GB of free storage space would be sufficient.

If you decide to go this route, it may be worthwhile to set up a cron job to run the following command periodically:

```sh
docker system prune -f
```

---

There will be more choices in [Going to Production](Secure.md), but this is enough for now.
Now that you've finished your preparations, the next part moves quickly.