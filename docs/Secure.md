# Securing Your Server

!!! overview
    - A reminder to use an SSH key, a password manager, and a firewall.
    - Instructions on updating both your application container and your server itself.

I am not a security professional, and likely neither are you. However, there are some good resources to get you started:

- [Security Best Practices for Deploying Rails 8 on Linux with Kamal](https://paraxial.io/blog/kamal-security)
- [Protect Linux Server From Hackers](https://liveoverflow.com/protect-linux-server-from-hackers/)
- [CVE Search results: Rails](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=rails)
- [CVE Search results: OpenSSH](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=openssh)

To summarize: there are three basic attack vectors—yourself, your application, and your server. There are also three things to protect: your secrets, your data, and your server.

---

## You

The good news is that if you followed the instructions in this book, you should be fine.

- You are not using a weak SSH password; instead, you set up an [SSH key](Assemble.md#ssh-key).
- You are not publishing your secrets on Docker Hub. Instead, you are either using a password manager (recommended) or have added the file containing your secrets to your `.gitignore` and `.dockerignore` files, following the [instructions here](Secrets.md).

---

## Your Application

With Kamal, all of your application's dependencies are listed in your Dockerfile and are packaged into a container, which is run in an isolated environment on your server with access only to the port you specified (generally 80 for Rails 8 applications) and the volumes you listed. Furthermore, the Dockerfile may be set up to run as a non-privileged user. Even so, a hacker could still get access to your secrets, your data, and potentially even intercept requests and modify responses.

The risk of this is low and generally requires you to take an action based on untrusted input. Reviewing the CVE list above for Rails (or the framework of your choice) can give you a sense of what you need to be concerned about.

Generally, the right fix is to update your dependencies frequently—for example, both your language (Ruby) version and framework (Rails) version as new versions are published, as well as any dependencies you may have added along the way. At times, this may require you to modify your `Dockerfile`.

---

## Your Server

Your application containers are running on a server, typically running a Linux distribution like Ubuntu. By default, servers are wide open, so it's vital to start by locking them down.

In [the server section](Assemble.md#server), you set up a firewall. If you haven't done so already, or if you're using a hosting provider other than Hetzner, do so now. The only ports that should be open to the internet are **22**, **80**, and **443**. If you are running a database other than Sqlite3, it is important that either the port that database is listening on is not open to the internet or you are using a managed database provider. Securing a database that is not professionally managed by others is beyond the scope of this book. Wanting access to a remote administrative interface is *not* a good enough reason to expose your database. Instead, host the remote administrative interface and expose only that.

Once locked down, **80** and **443** will be forwarded to your container. **22** is for OpenSSH. At the beginning of this chapter is a footnote containing the CVE (Common Vulnerabilities and Exposures) list for OpenSSH. New vulnerabilities are relatively infrequent, but at times the need to apply a fix can be fairly urgent.

Applying updates manually can be done via the following:

```sh
$ sudo apt-get upgrade
$ sudo apt-get dist-upgrade
```

You may also want to consider setting up automated unattended upgrades:

```sh
$ dpkg-reconfigure unattended-upgrade
```

---

## Trust, but Verify

At this point, you have a server that is locked down, a container that is isolated, and a secure way to access your server. But you should still verify that your server is secure, as the responsibility for security is ultimately yours. That's why you should [trust but verify](https://en.wikipedia.org/wiki/Trust,_but_verify).

I'll provide one example of how things can go wrong. It likely doesn't affect you if you are only running a web server, but it is illustrative.

If you are running multiple services on multiple ports, and you have a service that is listening on a port that is not intended to be open to the internet, check to see if it is open by running the client for that service. For example, if you are running a database server, you can try the client for that database on your desktop or laptop. If you can connect, then the port is open. If you can't, then the port is closed.

An open port can occur even if you properly set up your firewall. It turns out that both Docker and your firewall are running on your server, and Docker may open up ports that you didn't intend to be open to the internet. This is a [known issue](https://www.techrepublic.com/article/how-to-fix-the-docker-and-ufw-security-flaw/), and there are [ways to mitigate it](https://github.com/chaifeng/ufw-docker).

The lesson to take away from this is that it is quite possible to assemble a number of components that are each secure, but when combined, are not. If you told your firewall to lock down all ports but **22**, **80**, and **443**, and you told Docker to open up a port, then it is up to you to verify that the port is not open to the internet.

Ultimately, the set of components you are using is unique to you, and it is up to you to verify that when operated together as you have configured, the result is secure.