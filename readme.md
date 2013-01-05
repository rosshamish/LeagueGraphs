#[LeagueGraphs](http://www.leaguegraphs.com)

####A free online statistics tracker for ranked **and normal** queues in [League of Legends](http://www.leagueoflegends.com)
####Readme last updated Jan 5, 2013

---

**Here's how it works:**

1. Your 10 most recent games are always available from Riot in high detail.  
2. There is a glorious auto-update php machine that is always running. Once your name has been entered *once* on [LeagueGraphs](http://www.leaguegraphs.com), it is added to the machine's list of names.  
3. Each player is updated every 8 hours, minimum. If you can play more than 10 games in 8 hours, I applaud you, and I also recommend you visit the site during your marathon to let the database manually grab your game statistics.  
4. A manual update happens whenever you look yourself up, so graphs and data are also guaranteed up-to-date.
5. Wha-BAM!

---

If you notice something wrong, some weird formatting or data or wrong values, horrible errors, crashes, seriously anything, please [email me!](mailto:ross@leaguegraphs.com?subject=Bug Report)  
Email: **ross@leaguegraphs.com**

---

**Implemented Features:**

- Link sharing
 - Show off to your friends
- Database consistency and stability
- Automatic database updates, minimum every 8 hours per player
- Data availability in graph format
 - using [d3.js](http://www.d3js.org), initially learned from [Dan Foreman-Mackey](http://dan.iel.fm/)'s very cool [xkcd.js](http://dan.iel.fm/xkcd/)
- Winrate line graph overlay
- Filter by champion
 - How good am I *really* with Lee Sin?
 - How good is Kevin *really* with Teemo?
- Filter by game type
 - 'omg im lyke 90% winrate in normals but you just cant see it'
 - Using normals to improve, checking your improvement with certain champs as you go
- Filter by game range
 - Last 10, 20, 30 etc games
- Tabbed browsing
 - Each tab is a completely independant instance now, leading to easy player comparisons (open one up in each tab)
- Most played champions
 - Pie chart of champion frequency

---

**Planned Features:**

- Interactive graphs - zoom, pan, extra data on mouseover.
- Filter by teammate.
- Teammate & Enemy data crawling
 - Get data of the one specific game of every player in each game.
 - They won't be added to the auto-update until they use the site, but their data for that game will be available.
- [Suggest a feature](mailto:ross.anderson87@gmail.com?subject=[GitHub] [LeagueGraphs] Feature Request)

---

**Known deficiencies:**

- Data currently only available for NA servers
  - This is easily fixable, but for now simplicity is king.
- I am a student and don't have money to pay for server space or API calls to handle lots of people. Currently it looks like the max will be a little less than 10,000 players.
  - This is easily fixable with [donations :)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=5AK9LPZFB54L8&lc=CA&item_name=LeagueGraphs&currency_code=CAD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted)

---

All data is generously provided by [Riot Games](http://www.leagueoflegends.com) through the wonderful [Elophant API](http://www.elophant.com/developers/) by [Joshua Jones.](http://elophant.com/about)  
Using [twitter bootstrap](https://github.com/twitter/bootstrap) and [d3.js](http://www.d3js.org).