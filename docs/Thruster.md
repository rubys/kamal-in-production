# Optimizing

!!! overview
    - Two alternate ways to install Thruster

If you are running Rails 8, you are already set. The `Dockerfile` and `Gemfile` are already set up to use the latest version of Thruster.
You can skip forward to the next chapter: Staging.

[Thruster](https://github.com/basecamp/thruster?tab=readme-ov-file#thruster) provides a number of optimizations for your application:

- **HTTP/2 support:** This is a major improvement over HTTP/1.1 and is supported by all modern browsers. It is a binary protocol with header compression and is multiplexed, meaning that multiple requests can be sent at the same time.
- **Basic HTTP caching:** Requests for documents found in your `public` directory will be satisfied by the cache and will not hit your application.
- **X-Sendfile support:** Large assets can be streamed directly from your filesystem without first being loaded into memory.

Thruster is normally distributed as a Rails gem, but it can also be built from source.
To ensure that the resulting executable is compatible with the underlying operating system included as your base DockerHub image, add the following to your `Dockerfile`:

```dockerfile
# Build thruster
FROM base AS thruster
ARG GO_VERSION=1.24.1
ARG THRUSTER_VERSION=0.1.12
ARG THRUSTER_ARCHIVE=https://github.com/basecamp/thruster/archive
RUN apt-get update \
&& apt-get install -y wget \
&& cd /root \
&& wget https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz \
&& tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz \
&& wget ${THRUSTER_ARCHIVE}/refs/tags/v${THRUSTER_VERSION}.tar.gz \
&& tar -xzf v${THRUSTER_VERSION}.tar.gz \
&& cd thruster-${THRUSTER_VERSION} \
&& /usr/local/go/bin/go build -o bin/ ./cmd/... \
&& cp bin/thrust /usr/local/bin/
```

This will install the Go programming language, download the Thruster source code, build it, and copy the resulting executable to the `/usr/local/bin` directory.

An alternate method that can be adapted to work with most distributions:

```dockerfile
# Install Thruster
FROM base AS thruster
RUN apt-get update \
&& apt-get install -y ruby \
&& gem install thruster
```

In the final stage of your `Dockerfile`, add the following:

```dockerfile
# Copy thruster
COPY --from=thruster /usr/local/bin/thrust /usr/local/bin/
```

Finally, `thrust` needs to be added either as an `ENTRYPOINT` or prepended to the `CMD` in the `Dockerfile`.

That's it. You now have Thruster installed and ready to use. No configuration is required, and no changes to your application are needed.