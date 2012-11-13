#[LeagueGraphs](http://www.rosshamish.netau.net)

####A free online statistics tracker for League of Legends
####Readme last updated Nov 13, 2012

---

**Here's how it works:**

- The first time you use the site, only your last 10 games will be data-fyed. However:
 - Once your name has been entered *once* on [LeagueGraphs](http://www.rosshamish.netau.net), it is added to the auto-update php machine.
 - Each player is updated every 6 hours, minimum. If you can play more than 10 games in 6 hours, I applaud you, and I also recommend you visit the site during your marathon to let the database manually grab your game statistics.
- A manual update happens when you access your data on the site, so graphs/data are guaranteed up-to-date whilst also maintaining long-term consistency.

---

**The site is still heavily in beta.**

Please give it some slack while it is in development :) 

If you notice something wrong, some weird formatting or data or wrong values, seriously anything, please [email me!](mailto:ross.anderson87@gmail.com?subject=[GitHub] [LeagueGraphs] Bug Report)

---

**Implemented Features:**

- Database consistency and stability.
- Automatic database updates, minimum every 8 hours.
- Data availability in graph format
 - using [d3.js](http://www.d3js.org), initially learned from [Dan Foreman-Mackey](http://dan.iel.fm/)'s very cool [xkcd.js](http://dan.iel.fm/xkcd/)
- Winrate line graph overlay.
- Filter by champion
 - How good am I *really* with Lee Sin?
 - How good is Kevin *really* with Teemo?


---

**Planned Features:**

- Data availability via tables and custom searching.
- More expressive and better looking graphs.
- Interactive graphs - zoom, pan, extra data on mouseover.
- Filter by teammate.
- Filter by date range.
- Teammate data crawling
 - Get all your teammates into the database, this will expand the database like crazy, but also might put unnecessary stress on the database of players who might never even check it.
- A real domain and web host.
- [Suggest a feature](mailto:ross.anderson87@gmail.com?subject=[GitHub] [LeagueGraphs] Feature Request)

---

**Known deficiencies:**

- Data currently only available for NA servers
    - This is easily fixable, but for now simplicity is king.
- I don't have money to pay for server space to handle lots of people. Currently it looks like the max will be about 10 000 players.
    - This is easily fixable with [donations :)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=5AK9LPZFB54L8&lc=CA&item_name=RossHamish%20Lol%2dStats%20Server&currency_code=CAD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

---

All data is generously provided by [Riot Games](http://www.leagueoflegends.com) through the wonderful [Elophant API](http://www.elophant.com/developers/) by [Joshua Jones.](http://elophant.com/about)
Using [twitter bootstrap](https://github.com/twitter/bootstrap) and [d3.js](http://www.d3js.org).