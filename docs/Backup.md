# Backing Up Your Database

!!! overview
    - Installing and configuring Litestream
    - Using `rclone` for off-site backups

Running in production is much more than just deploying your application. It's about keeping your application running smoothly and your data safe.
If your server goes down, a new one can be started in minutes. If your data is lost, it is lost forever.

If you look at your `config/database.yml`, you will see that it contains definitions for four databases: primary, cache, queue, and cable. For sqlite3, these are stored in a storage directory, which is mapped to a directory on your host machine. This is where your data is stored.
It is possible to back up all four, but for now we are going to focus on the primary database.
The primary database is the one that contains your users, products, and orders. It's the one you can't afford to lose.
Because you set up a volume, your data is safe as long as your host machine is running. But what if your host machine goes down?

```yaml
# config/database.yml
# ...your database.yml content here...
```

As the comments state, these databases are stored in a persistent Docker volume.
Docker stores its data in a directory called `/var/lib/docker`.
Inside that directory is a directory called `volumes`. You created a volume called `depot_storage`. Inside the `volumes` directory is a file named `production.sqlite3`. This is your database.

[Litestream](https://litestream.io/) is a tool that can be used to back up your database. It is free and open source, easy to set up, and can back up to the S3 Object Storage you have already set up. It can also be used to restore your database to a point in time.

We could run it in your Kamal container, or as a Kamal accessory, but that requires building an image and pushing it to a repository.  Instead we are going to run it on your host machine.

Following Litestream's [installation instructions](https://litestream.io/install/debian/), first SSH into your host and run the following commands:

```sh
apt-get update
apt-get install -y wget
export LITESTREAM=https://github.com/benbjohnson/litestream/releases/download
wget $LITESTREAM/v0.3.13/litestream-v0.3.13-linux-amd64.deb
dpkg -i litestream-v0.3.13-linux-amd64.deb
rm litestream-v0.3.13-linux-amd64.deb
```

Note: if you have chosen an arm64 host, substitute `arm64` for `amd64` in the instructions above.

Now find the `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `ENDPOINT_URL`, `REGION`, and `BUCKET_NAME` in your password manager.
Then run `nano /etc/litestream.yml`. Replace the file with the following, substituting in the values you found in your password manager:

```yaml
# /etc/litestream.yml
# This is the configuration file for Litestream.
#
# For more details, see: https://litestream.io/reference/config/
#
dbs:
  - path: /var/lib/docker/volumes/depot_storage/production.sqlite3
    replicas:
      - type: s3
        access-key-id: ACCESS_KEY_ID
        secret-access-key: SECRET_ACCESS_KEY
        endpoint: ENDPOINT_URL
        region: REGION
        bucket: BUCKET_NAME
        path: storage/production.sqlite3
```

Exit nano by pressing Ctrl-X, then press Y to save the file.
**Note:** Do *not* store this data in git.

Now start the Litestream service:

```sh
systemctl enable litestream
systemctl start litestream
```

Once configured, Litestream is pretty much set-and-forget. It will back up your database after every write, and can be used to restore your database to a point in time.
The [Litestream reference](https://litestream.io/reference/) is a good place to start if you want to learn more.

While our data is backed up in S3, it is not truly off-site. On a separate machine (this can be your laptop), install [rclone](https://rclone.org/) and use `rclone sync` to extract a copy of your data. Set up a cron job to run this command daily.