# Monitoring Your Application

!!! overview
    - Installing and configuring Vector to ship your logs
    - Running multiple applications on a single host
    - Other monitoring tools

When you deploy your application to production, you'll want to be able to find information contained in your logs. This is especially true if you have a lot of users, as you'll want to be able to quickly find and fix any issues that arise.

Kamal provides a command to watch your logs in real time: `bin/kamal app logs --follow`. This is useful if you are actively watching at the time of a failure.

Docker captures logs and places them in `/var/lib/docker/containers/*/local-logs/*.log`. You can use a tool like `grep` to search these logs, but it is not very user-friendly. You also have to know which container to look in.

Kamal (by default) keeps the last five containers, so if you deploy infrequently your logs may have gaps, and if you deploy too frequently you may not have log entries that span enough time.

## Observability

[Observability](https://opentelemetry.io/docs/concepts/observability-primer/) is more than just logs.

[Michal Kazmierczak](https://mkaz.me/) posted [Self-hosted observability for Ruby on Rails apps with Kamal and OpenTelemetry](https://mkaz.me/blog/2024/self-hosted-overvability-for-ruby-on-rails-apps-with-kamal-and-opentelemetry/) along with a [GitHub repository](https://github.com/michal-kazmierczak/opentelemetry-rails-example) containing a [`config/deploy.yml`](https://github.com/michal-kazmierczak/opentelemetry-rails-example/blob/main/rails_app/config/deploy.yml) to be used with Kamal.

Included in the repository is a note:

> **Storage and query backends**
> Since this demo presents a self-hosted approach, this part represents the long-term storage and query API backends. It's strongly recommended to run these services on a separate host to increase the likelihood of accessing observability data during application outages.

This presents a challenge. Looking at the tools Kamal provides:

* Different Kamal apps with different iamges can be run on different machines. Access to these apps is through a HTTP proxy.
* [Roles](https://kamal-deploy.org/docs/configuration/roles/) can be used to run the same image on different machines, generally with a different start command.
* [Accessories](https://kamal-deploy.org/docs/configuration/accessories/) run different images in separarate containers on the same server.

If you are running a single app, accessories are fine for collection and processing agents. But since I am running multiple applications, I went a different way.

## Vector

Core to data collection and distribution is a tool named [Vector](https://vector.dev/). Vector can be used to send your logs to a number of services and can filter your logs before they are sent. It is easy to run Vector outside of a container, and such a process will have direct and full access to logs from all of your Docker containers.

To install Vector, SSH into your host and run the following commands:

```sh
bash -c "$(curl -L https://setup.vector.dev)"
apt-get install -y vector
```

This will add the Vector repository and then install the vector package. If you are using another operating system, refer to the
[installation docs](https://vector.dev/docs/setup/installation/) for more options.

Once installed, you will need to configure Vector. Vector is configured using a file named `/etc/vector.yaml`. Instructions for a number of services can be found in the [Vector documentation](https://vector.dev/docs/reference/configuration/sinks/).

Run `nano /etc/vector.yaml`, and replace the file with the following:

```yaml
sources:
  docker:
    type: "docker_logs"

sinks:
  nats:
    inputs:
      - "docker"
    type: "console"
    encoding:
      codec: "text"
```

Fill in the definition of the sink based on the service you selected. Exit nano by pressing Ctrl-X, then press Y to save the file. You can run Vector by running the following command:

```sh
vector --config vector.yaml
```

Visit your application's website and perform some actions. You should see the logs in your console. Next, edit `/etc/vector.yaml` once again and replace the definition of the sink based on the service you selected. Finally, give Vector permission to access Docker's information, and start the Vector service:

```sh
usermod -aG docker vector
systemctl enable vector
systemctl start vector
```

Note: The service you choose can be one that you write yourself. Vector can be used to send logs to [NATS](https://nats.io/), which you can subscribe to in a service that you write yourself. Vector can even be used to send logs to multiple services at once.

Fly.io has published a blueprint: [Observability for User Apps](https://fly.io/docs/blueprints/observability-for-user-apps/) which includes two example apps: [fly-telemetry](https://github.com/superfly/fly-telemetry) and [nat-stream](https://github.com/fly-apps/natstream) (along with a [demo](https://natstream.fly.dev/)). You can use them on your own infrastructure, you simply would need to adjust the listening port and add authentication.

---

## Consuming your own logs

This section isn't meant to be a recommendation, but rather an example to show you what is possible. The origins of my showcase application were entirely self-hosted, and I wrote a simple CGI script to consume the logs. When I deployed to Fly.io, I missed having this view of my users' activity, so I built a more [feature-rich version of it](https://github.com/rubys/showcase/tree/main/fly/applications/logger). Since my application is hosted using [Phusion Passenger](https://www.phusionpassenger.com/) and [nginx](https://www.nginx.com/), I get a single, configurable log line for each request. I wrote a simple web server, using Bun, to consume these logs, look for these log lines, and display them in a web page. As each request has a unique request ID, I can use this to correlate the logs from other sources (primarily Rails). I can click on a log line and see the entire set of log entries for that request. I can also click on the request path and actually go to the page that was requested.

One possibly underappreciated feature of Kamal's proxy is that it can be used with multiple applications. While prominently mentioned in the [Kamal 2.0 release announcement](https://dev.37signals.com/kamal-2/), the [documentation](https://kamal-deploy.org/docs/configuration/proxy/#host/) does little to explain how to do this.

To start with, go into the service for which you registered the domain name, and add a second **A** record for the second application. If you are using Cloudflare, once again specify DNS only by unchecking the orange proxy status button. Feel free to name the subdomain whatever you like. As an example, my primary application is at `showcase.party`, and my logger application is at `logger.showcase.party`. Feel free to use the same IP address for both. Then go into the second application and add the domain name to the `config/deploy.yml` file for that application.

That's it. You can now use `kamal deploy` on your logger application, and it will be available at the DNS name you specified.

For this application, you also need to feed it data. For that, use [NATS](https://nats.io/). Install it on your host machine with:

```sh
apt-get install -y nats-server
```

Edit the following line in your `/etc/vector.yaml` file:

```yaml
host: 0.0.0.0
```

Then update your `/etc/vector/config.yaml` file to include the following:

```yaml
sinks:
  nats:
    inputs:
      - "docker"
    type: "nats"
    subject: "logs.{{ host }}"
    url: "nats://localhost"
    encoding:
      codec: "json"
```

And restart both services:

```sh
systemctl restart nats-server
systemctl restart vector.service
```

You can test that it works using the [NATS CLI](https://nats.io/documentation/tutorials/nats-cli/):

```sh
curl -sf https://binaries.nats.dev/nats-io/natscli/nats@latest | sh
./nats server check connection
```

This is a simple example of what is possible. I also use the Kamal proxy to host a [third application](https://fly.io/blog/print-on-demand/), one that uses [Puppeteer](https://pptr.dev/) to take screenshots of the pages that are requested. Serving PDFs is often easier than talking people through how to print a web page.

---

## Additional Monitoring Tools

You can also send your logs to a service like [DataDog](https://www.datadoghq.com/), [Elasticsearch](https://www.elastic.co/), or [Loki](https://grafana.com/oss/loki/). These services can be used to search your logs and create alerts when certain conditions are met.

Most come with some sort of free tier and can be set up in minutes. Prices are generally based on the amount of data you send them.
[Dozzle](https://dozzle.dev/) and [Logdy](http://logdy.dev) are free alternatives.
Some can be self-hosted, but again if you go this route you will want to set up a separate machine to run them on.

[AppSignal](https://appsignal.com/), [Honeybadger](https://www.honeybadger.io/), [New Relic](https://newrelic.com/), [Rollbar](https://rollbar.com/), [Sentry](https://sentry.io/), and [Scout](https://scoutapm.com/) are tools that can be used to monitor your application's performance and create alerts when certain conditions are met.

Mobi/dev has a list of [guide for protecting your business and customer data](https://mobidev.biz/blog/ruby-on-rails-security-guide-protecting-your-business-and-customer-data).

The host you select will often offer tools to prevent DDoS attacks and to monitor your server's performance. You will want to enable these. [Cloudflare DDoS protection](https://www.cloudflare.com/lp/dg/brand/ddos/) may be worth exploring.