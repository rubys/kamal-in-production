# PaaS not required?

Time to address the elephant in the room: why is an employee of a PaaS company writing a book on Kamal?

- I was a book author before I was a Fly.io employee. A book on Rails 8 would be incomplete without covering Kamal.
- When I researched Kamal for Agile Web Development with Rails 8, I came up with more material than made sense to include in that book.
- I'm a technologist, not a salesman. Deploying applications, including Rails, is my current area of focus.
- The deployment model for both Kamal and Fly.io is very compatible, and anything that encourages that deployment model will benefit both.

Had Kamal 2.0 existed before I joined Fly.io, I probably would have gone with that, which in the long run would have been a loss, as I've learned so much.

And I certainly agree that Kamal was the right bet for 37signals.  
[The Big Cloud Exit FAQ](https://world.hey.com/dhh/the-big-cloud-exit-faq-20274010)

I encourage everybody to watch David Heinemeier Hansson's Rails World 2024 Opening Keynote.  
[Watch the keynote](https://www.youtube.com/watch?v=-cEn_83zRFw)  
Some of the points DHH makes do not apply to Fly.io; other parts I disagree with, but come to your own conclusion.

But I will post a few topics for you to ponder:

- If your application is only running for 60 hours a week, why pay for 168?
- Part of Rails' core strength is Convention over Configuration and the Menu is Omakase, as is No One Paradigm and Provide Sharp Knives.
  [Rails Doctrine](https://rubyonrails.org/doctrine)  
  When evaluated against these criteria, Kamal and PaaS providers come on strong in some areas and weaker in others.
- Is managing host availability and security part of your core business, or would you rather leave that to others?

Ultimately, the decision as to what is right for you can only be made by you.

But superseding all that is the freedom to move. You should be able to start out at Fly.io, move to Hetzner, then to DigitalOcean, and finally back to Fly.io at any time. Once you have that, the rest will take care of itself.

I'll close with a challenge. I posted a trivial application in the [Local](Local.md) chapter. You've tried it with Kamal. Now try it with each of the following providers. Feel free to switch to PostgreSQL. If you stick with Sqlite3, add Litestream.

- Fly.io ([docs](https://fly.io/rails))
- Heroku ([getting started](https://devcenter.heroku.com/articles/getting-started-with-rails8))
- Railway ([guide](https://docs.railway.com/guides/rails))
- Render ([docs](https://render.com/docs/deploy-rails))

Ideally, you will have success with multiple vendors. Then you can pick the one that is best suited to your needs—and switch later should you desire.