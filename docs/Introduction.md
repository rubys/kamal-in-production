# Introduction

!!! overview
    - To truly understand Kamal, you need to become familiar with the greater Docker ecosystem.

The goal of this book is to walk you step by step through your first deployment to production using Kamal.

It is written for developers who are familiar with a web application framework like Ruby on Rails, but perhaps not so much with Docker, and may not have experience deploying their applications in production.

Pretty much the only requirement is some familiarity with the command line.

## What is Kamal?

Let's start with what Kamal is, taken directly from their website: [https://kamal-deploy.org/](https://kamal-deploy.org/)

> Kamal offers zero-downtime deploys, rolling restarts, asset bridging, remote builds, accessory service management, and everything else you need to deploy and manage your web app in production with Docker. Originally built for Rails apps, Kamal will work with any type of web app that can be containerized.

Kamal depends heavily on the functionality of Docker.
To illustrate the target audience of Kamal, I'm going to succinctly state some rather basic background information that is necessary to confidently make changes to the Rails 8 generated Dockerfiles:

> Most [official Ruby Docker Hub images](https://hub.docker.com/_/ruby)
> are based on [Debian bookworm](https://www.debian.org/releases/bookworm/),
> which provides a [large number of packages](https://packages.debian.org/bookworm/)
> that you can install. Simply find the packages that you need and add them to the `apt-get install` line in the relevant
> [build stage](https://docs.docker.com/build/building/multi-stage/).

If only some of these words are familiar, that's OK. In fact, that illustrates the gap between the knowledge necessary to use Kamal effectively and what a typical application developer is familiar with.
This book will endeavor to help you bridge that gap.

## What is Ruby on Rails?

!!! NOTE "Using a Different Framework?"

    You may be using a different web application framework, but this section will illustrate what you need to know using Ruby on Rails.
    Other sections will cover other frameworks. In general, the principles are the same, but in the few known cases where there are differences, these differences will be pointed out. If you spot other differences, please let me know so that this book can be improved for others that follow.

Now let's explore the profile of a typical Ruby on Rails developer, which we can infer from their website:
[https://rubyonrails.org/](https://rubyonrails.org/)

> Learn just what you need to get started, then keep leveling up as you go. Ruby on Rails scales from HELLO WORLD to IPO.

It is fair to conclude from this that a typical Ruby on Rails developer meets some or all of the following characteristics:

- member of a small team
- subject matter expert for the business the app is designed for

## Intersection of the prior two groups

Based on my experience at Fly.io, the overlap between the target audience of Kamal and the Ruby on Rails development community isn't as large as you might think or hope.

The purpose of this book is to help you bridge that gap.

A typical scenario: a team is formed and creates an application. When they start, they are provided with a Dockerfile capable of building and image for a HELLO WORLD application. After several months of effort, they are ready to deploy. Undoubtedly, they have made at least one change that requires a modification to the Dockerfile, and they find that they don't have the skills necessary to make that change.

Make no mistake about it—we are talking about intelligent, motivated people. They just may have never used a Debian Linux operating system before, so commands like `apt-get` may be unfamiliar to them.

## What this book is not

This book is for busy developers who want to get up and running quickly. So be aware of the following:

- It is not a book on how to write a Ruby on Rails application, or an application using another framework.
  I'm admittedly biased, but I recommend [Agile Web Development with Rails 8](https://pragprog.com/titles/rails8/agile-web-development-with-rails-8/).
- It is not a book on how to use Docker. If you are entirely new to Docker, you can find an introduction in the
  [Fly.io documentation](https://fly.io/docs/rails/cookbooks/),
  which describes the thinking behind my contributions to the Rails-provided Dockerfile.
- It is not a comprehensive guide to Kamal, describing every possible command you could ever use, in alphabetical order.
  See the [Assemble chapter](Assemble.md) for references.

Instead, this is a book on *Deployment to Production*, making heavy use of Kamal. It will show you the steps you need to take, and the order in which to take them. It will show you where the gaps are, and what you can use to fill those gaps.

At the end of this short book, you will have deployed your first application to production. You will have a good understanding of what you did and why you did it.
And, equally as importantly, you will know what questions to ask next.