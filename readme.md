#[LeagueGraphs](http://www.rosshamish.netau.net)

####A free online statistics tracker for League of Legends
####Readme last updated Nov 02, 2012

---

**Here's how it works:**

- The first time you use the site, only your last 10 games will be data-fyed. However:
 - Once your name has been entered *once* on [LeagueGraphs](http://www.rosshamish.netau.net), it is added to the auto-update php machine.
 - Each player is updated minimum once or twice a day. 
- A manual update happens when you access your data on the site, so graphs/data are guaranteed up-to-date whilst also maintaining long-term consistency.

---

**The site is still heavily in beta.**

Please give it some slack while it is in development :) 

If you notice something wrong, some weird formatting or data or wrong values, seriously anything, please [email me!](mailto:ross.anderson87@gmail.com?subject=[GitHub] [LeagueGraphs] Bug Report)

---

**Implemented Features:**

- Database consistency and stability.
- Automatic database updates daily.
- Data availability in graph format
 - using [d3.js](http://www.d3js.org), initially learned from [Dan Foreman-Mackey](http://dan.iel.fm/)'s very cool [xkcd.js](http://dan.iel.fm/xkcd/)

---

**Planned Features:**

- Data availability via tables and custom searching.
- More expressive and better looking graphs
- More versatile graph manipulation
- Graph interaction
- A real domain and web host.
- Custom analysis
    - What is the relationship between my total gold earned and my time spent dead?
    - What is the relationship between the number of wards I buy and my winrate?
    - How often do I win with item A vs item B?
    - [Suggest a data point](mailto:ross.anderson87@gmail.com?subject=[GitHub] [LeagueGraphs] Data Suggestion)
- [Suggest a feature](mailto:ross.anderson87@gmail.com?subject=[GitHub] [LeagueGraphs] Feature Request)

---

**Known deficiencies:**

- Data currently only available for NA servers
    - This is easily fixable, but for now simplicity is king.
- I don't have money to pay for server space to handle lots of people.
    - This is easily fixable with [donations :)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=5AK9LPZFB54L8&lc=CA&item_name=RossHamish%20Lol%2dStats%20Server&currency_code=CAD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

---

All data is generously provided by [Riot Games](http://www.leagueoflegends.com) through the wonderful [Elophant API](http://www.elophant.com/developers/) by [Joshua Jones.](http://elophant.com/about)
Using [twitter bootstrap](https://github.com/twitter/bootstrap) and [d3.js](http://www.d3js.org).