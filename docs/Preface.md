# Preface

My name is Sam Ruby. I work for [Fly.io](https://fly.io) because I believe in Platform as a Service (PaaS) in general, and in our company's offering in particular.
I am writing this book because I believe in Kamal. Yes, it is indeed possible to endorse both. It is also possible to switch back and forth, and even run them side by side. I have done all of these things.

Since [2008](https://rubyonrails.org/2008/4/23/agile-web-development-with-rails-3rd-edition), [I have been the primary author of Agile Web Development with Rails.](https://pragprog.com/titles/rails8/agile-web-development-with-rails-8/)
I have also been a [contributor to the Ruby on Rails framework itself](https://contributors.rubyonrails.org/contributors/sam-ruby/commits), and in particular
[contributed heavily](https://github.com/rails/rails/blame/7-1-stable/railties/lib/rails/generators/rails/app/templates/Dockerfile.tt)
to the `Dockerfile` that was originally shipped with Rails 7.1.
[DHH said that he liked what we were doing.](https://x.com/dhh/status/1632044101418745864)

Over the years, I've written and deployed a number of Rails applications, primarily to keep my skills fresh.
In 2022, I wrote a [dance showcase application](https://github.com/rubys/showcase#showcase). It is open source and free of charge. I initially deployed it on a Mac Mini in my attic, but became concerned that a power or network outage would make this application unavailable while a dance showcase event was taking place when the application's functionality is most critical.
I therefore explored a number of cloud offerings to host my application. I chose Fly.io, and as luck would have it, at the time they were looking for a Rails specialist, so I [unretired](https://intertwingly.net/blog/2022/08/13/Unretiring).

At the time of this writing, the app is running on twelve hosts, serving 65 dance studios in eight countries on four continents.
It is also deployed on Hetzner via Kamal. It also has two companion applications, both written in JavaScript. These application are also deployed both on Fly.io and on Hetzner.

[**Rails 8.0: No PaaS Required**](https://rubyonrails.org/2024/11/7/rails-8-no-paas-required) was released in November of 2024. Truth be told, a PaaS never has been required. In 2008, DHH wrote
[*Myth #1: Rails is hard to deploy*](https://dhh.dk/posts/30-myth-1-rails-is-hard-to-deploy):

> In conclusion, Rails is no longer hard to deploy. Phusion Passenger has made it ridiculously easy.

There are people today who deploy applications using Capistrano, Ansible, Chef, Puppet, and even Docker.
Use the tool you like. Try multiple.

Just realize one important thing: running in production is more than simply copying files to a server and starting a process.
At a minimum, it is ensuring that your database is backed up, that your logs are searchable, and that your application is being monitored. It is also about ensuring that your application is secure.

This book is about my journey. I'm sharing it in the hope that it will inspire yours.

---

**Sam Ruby**
2025-05-26
