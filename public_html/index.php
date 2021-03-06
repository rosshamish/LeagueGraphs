<!DOCTYPE HTML>
<html lang="en">
<head>
<meta charset="utf-8">
<title>League Graphs</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="
	This is LeagueGraphs, a free statistics tracker for League of Legends.
	Finally, a way to follow your normal games.
	All with no download, no installation and no hassle.
">
<meta name="author" content="Ross Anderson">
<link href='http://fonts.googleapis.com/css?family=Abel' rel='stylesheet' type='text/css'/>

<!-- Styles -->
<link href="bootstrap/css/bootstrap.min.css" type="text/css" rel="stylesheet">
<style type="text/css">
      body {
        padding-top: 60px;
        padding-bottom: 40px;
      }
      .sidebar-nav {
        padding: 9px 0;
      }
      rect:hover {
      	cursor: pointer;
      }
</style>
<link href="extra.css" type="text/css" rel="stylesheet">
<link href="jquery.powertip/jquery.powertip.css" type="text/css" rel="stylesheet">
<link rel="stylesheet" href="css/prettyLoader.css" type="text/css" media="screen" charset="utf-8" />
<link href="bootstrap/css/bootstrap-responsive.min.css" type="text/css" rel="stylesheet">
<!-- /Styles -->

<!-- Start Google Analytics Code -->
<script type="text/javascript">
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-35852559-1']);
      _gaq.push(['_trackPageview']);
      (function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
</script>
<!-- /Google Analytics Code -->

</head>
<body>
<div class="navbar navbar-fixed-top">
	<div class="navbar-inner">
		<div class="container-fluid">
			<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
			</a>
			<a class="brand" href="#">LeagueGraphs</a>
			<div class="nav-collapse collapse">
				<p class="navbar-text pull-right">
					<a href="http://www.elophant.com" target="_blank" title="elophant.com" class="navbar-link">powered by elophant.com</a>
				</p>
				<ul class="nav">
					<li><a href="#aboutModal" type="button" data-toggle="modal">About</a></li>
					<li><a href="#contactModal" type="button" data-toggle="modal">Contact</a></li>
				</ul>
				<form accept-charset="utf-8" class="form-inline navbar-search" action="" method="">
					<input class="span2 summoner_search_input" id="summonerName_nav" type="text" data-provide="typeahead" placeholder="Summoner Name">
					<button id="submit_btn_nav" class="btn summoner_search_btn" type="submit">Go!</button>
				</form>
			</div> <!--/.nav-collapse -->
		</div> <!--/.container-fluid -->
	</div> <!--/.navbar-inner -->
</div> <!--/.navbar-fixed-top -->

<!-- Modals -->
<!-- 'About' Modal -->
<div id="aboutModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="aboutModalLabel" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
		<h3 id="myModalLabel">About Us</h3>
	</div>
	<div class="modal-body">
		<p>
			Hi, my name is Ross.<br>
			<br>
			I am currently a student working on an Engineering degree up in cold, friendly Canada (eh).<br>
			Things I like: tennis, turkey and over-competitive holiday parties.<br>
			Things I dislike: outdated milk and people who dislike too many things.<br>
			<br>
			I'm just a guy who likes League and is learning web development. <a href="mailto:ross@leaguegraphs.com">Show me some love.</a>
			<br>
			Spread the word!<br>
			<b>- Ross</b>
		</p>
	</div>
</div> <!-- /'About' Modal -->
<!-- 'Contact' Modal -->
<div id="contactModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="contactModalLabel" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
		<h3 id="myModalLabel">Contact Us</h3>
	</div>
	<div class="modal-body">
		<p>
			Feel free to <a href="mailto:ross@leaguegraphs.com" target="_blank">email me</a> or
			check out my <a href="http://www.github.com/RossHamish/LeagueGraphs">GitHub page</a>.<br>
			<br>
			 If you have feedback, suggestions, comments or just want to chat, you can get me at: <b>ross@leaguegraphs.com</b><br>
			 <br>
			Are you a dev yourself? This project is open-source! Feel free to take anything and use it yourself. Alternatively, you could
			contribute by writing a feature and submitting it on <a href="http://github.com/rosshamish/leaguegraphs">Github!</a><br>
			<br>
			Notice an issue? <a href="http://github.com/rosshamish/leaguegraphs/issues/new">Submit an issue</a> and I'll get to it pronto.<br>
			<br>
		    Spread the word!<br>
			<b>- Ross</b>
		</p>
	</div>
</div> <!-- /'Contact' Modal -->
<!-- /modals -->

<!-- Main container -->
<div class="container-fluid">
	<div class="row-fluid">
		<div class="span12">
			<div class="hero-unit">
				<h1>League Graphs</h1>
				<div class="cushycms" id="intro">
					<h3>This is <b>League Graphs</b>, a free statistics tracker for League of Legends.</h3>
					<h4>How it works:</h4>
					<p>
					Once your summoner name is entered here <b>once</b>, your stats will be tracked automatically forever and ever afterwards.
					Every player <em>known to the site</em> gets updated at least once every 8 hours.
					<small>Note: If you play more than 10 games in 8 hours, just come enter your name and your profile will be updated manually.</small><br>
					</p>
				</div> <!-- /#intro -->
				<div id="updates" class="alert alert-error" hidden>
				</div> <!-- /#updates -->
				<div id="meta_stats">
					<p>
						Currently tracking <strong><span id="currently_tracking">0</span></strong> players, with <strong><span id="games_in_database">0</span></strong> games tracked all time.
					</p>
					<div id="player_stats" hidden>
						<p>
						 Tracking <b><span id="summoner_name"></span></b> since <strong><span id="tracking_since"></span></strong>. <br>
						<strong><span id="games_tracked"></span></strong> games data-fyed since then.<br>
						<p>
					</div> <!-- /#player_stats -->
				</div> <!-- /#meta_stats -->
				<div id="search_form" class="input control-group">
					<form accept-charset="utf-8" name="search_form" class="form-inline" action="" method="">
						<legend> Enter your summoner name. Be known.</legend>
						<input class="span2 summoner_search_input" id="summonerName" type="text" placeholder="Summoner Name">
						<button id="submit_btn" class="btn btn-primary summoner_search_btn" type="submit">Go!</button>
					</form>
				</div> <!-- /#search_form -->
				<!-- IE notice -->
				<div class="text-error" id="check_ie">
				</div> <!-- /IE notice -->
			</div> <!-- /hero unit -->
			
			<!-- Google AdSense ad -->
			<script type="text/javascript"><!--
			google_ad_client = "ca-pub-5054199050170507";
			/* Banner b/w intro and graph */
			google_ad_slot = "7272543355";
			google_ad_width = 728;
			google_ad_height = 90;
			//-->
			</script>
			<script type="text/javascript"
			src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
			</script>
			
			<hr>
			<!-- /Google AdSense ad -->
			
		</div> <!-- /span12 -->
	</div> <!-- /row intro + ad -->
			
	<div class="row-fluid">
			<!-- Nav tabs (Graph / Champions) -->
			<ul class="nav nav-tabs" id="tabs">
			  <li class="active"><a href="#row_graph" data-toggle="tab">Games</a></li>
			  <li><a href="#row_champs" data-toggle="tab">Champions</a></li>
			  <li><p class="sharelink_label">Share: </p></li>
			  <li><input class="sharelink" value="http://leaguegraphs.com/" type="text" /></li>
			</ul> <!-- /Nav tabs -->
			   
			<div class="tab-content">
			  <div class="tab-pane active" id="row_graph">
				  <div id="row_graph" class="row-fluid">
					  <div class="span7">
						  <h3>Numbers</h3>
						  <h5>I'd Like to See My:</h5>
						  <form id="checkboxes" name="checkboxes" class="">
						  </form>
					  </div> <!-- //span7 -->
					  <div class="span5">
						  <h3>Filters</h3>
						  <div class="">								
							  <div class="btn-toolbar">
								  <div class="btn-group">
									  <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
										  <span class="time_filter_label">All Time</span>
										  <span class="caret"></span>
									  </a>
									  <ul class="dropdown-menu">
										  <li><a class="time_filter" id="ever" href="#" data-range="20000">All Time</a></li>
										  <li><a class="time_filter" id="ten_games" href="#" data-range="10">Last 10 Games</a></li>
										  <li><a class="time_filter" id="twenty_games" href="#" data-range="20">Last 20 Games</a></li>
										  <li><a class="time_filter" id="thirty_games" href="#" data-range="30">Last 30 Games</a></li>
										  <li><a class="time_filter" id="sixty_games" href="#" data-range="60">Last 60 Games</a></li>
									  </ul>
								  </div>
								  <div class="btn-group">
									  <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
										  <span class="gametype_filter_label" id="gametype_filter_label">All Game Types</span>
										  <span class="caret"></span>
									  </a>
									  <ul class="dropdown-menu">
										  <li><a class="gametype_filter" id="all" href="#">All Game Types</a></li>
										  <li><a class="gametype_filter" id="NORMAL" href="#">Normal 5v5</a></li>
										  <li><a class="gametype_filter" id="NORMAL_3x3" href="#">Normal 3v3</a></li>
										  <li><a class="gametype_filter" id="RANKED_SOLO_5x5" href="#">Ranked Solo Queue</a></li>
										  <li><a class="gametype_filter" id="RANKED_TEAM_5x5" href="#">Ranked Team 5v5</a></li>
										  <li><a class="gametype_filter" id="RANKED_TEAM_3x3" href="#">Ranked Team 3v3</a></li>
										  <li><a class="gametype_filter" id="ODIN_UNRANKED" href="#">Dominion</a></li>
									  </ul>
								  </div>
							  </div><!-- GameRange and GameType filters -->
							  <h5>When I Play As:</h5>
							  <div class="input control-group btn-group champ_input_form" data-toggle="buttons-radio">
								  <button class="btn span3 active champ_filter_all_champs" type="button">Anyone</button>
								  <form name="champ_input_form" class="form-inline" action="" method="">
									  <button class="btn span3 champ_filter_btn" type="submit" type="button">Only</button>
									  <input class="span3 champ_filter_input" type="text" placeholder="Blitzcrank" id="champname"/>
								  </form>
							  </div><!-- Champ filter -->
						  </div>
					  </div> <!-- //span5 -->
				  </div>
				  <!-- //row-fluid TOP -->
				  <div class="row-fluid">
					  <div class="span12">
						  <h2><span class="graph_title"></span><span class="gametype_title"></span></h2>
						  <div id="graph" class="">
							  <svg></svg>
						  </div>
					  </div> <!--/span-->
				  </div> <!--/row-->
				  <!-- Selected Game -->
				  <div class="row-fluid">
					  <div class="span12">
						  <table class="table table-bordered">
						  <thead id="selected_game_table"><h4>Selected Game: <span id="selected_game_date"></span></h4></thead>
						  <tbody>
						  <tr id="selected_game_row" class="">
							  <td id="champ">
								  <span id="champ">---</span>
							  </td>
							  <td class="kda">
								  <img src="images/icon-sword.png" />
								  <span id="kills">---</span>
								  
								  <img src="images/icon-skull.png" />
								  <span id="deaths">---</span>
								  
								  <img src="images/icon-assists.png" />
								  <span id="assists">---</span>
								  
								  <img src="images/icon-cs.png" />
								  <span id="creep_score">---</span>
							  </td>
							  <td id="item0">
								  <span id="item0">---</span>
							  </td>
							  <td id="item1">
								  <span id="item1">---</span>
							  </td>
							  <td id="item2">
								  <span id="item2">---</span>
							  </td>
							  <td id="item3">
								  <span id="item3">---</span>
							  </td>
							  <td id="item4">
								  <span id="item4">---</span>
							  </td>
							  <td id="item5">
								  <span id="item5">---</span>
							  </td>
							  <td>
								  Trending Winrate: <span id="wr">--</span>%
							  </td>
						  </tr>
						  </tbody>
						  </table>
					  </div>
					  <!--/div table-->
				  </div> <!--/selected game-->
			  </div> <!--/tab #row_graph -->
			  
			  <!-- Champions tab pane -->
			  <div class="tab-pane" id="row_champs">
				  <div class="span7">
				  </div> <!-- //span7 -->
				  <div class="span5">
					  <h3>Filters</h3>
					  <div class="">
						  <div class="btn-toolbar">
							  <div class="btn-group">
								  <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
									  <span class="time_filter_label">All Time</span>
									  <span class="caret"></span>
								  </a>
								  <ul class="dropdown-menu">
									  <li><a class="time_filter" id="ever" href="#">All Time</a></li>
									  <li><a class="time_filter" id="ten_games" href="#">Last 10 Games</a></li>
									  <li><a class="time_filter" id="twenty_games" href="#">Last 20 Games</a></li>
									  <li><a class="time_filter" id="thirty_games" href="#">Last 30 Games</a></li>
									  <li><a class="time_filter" id="sixty_games" href="#">Last 60 Games</a></li>
								  </ul>
							  </div>
							  <div class="btn-group">
								  <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
									  <span class="gametype_filter_label" id="gametype_filter_label">All Game Types</span>
									  <span class="caret"></span>
								  </a>
								  <ul class="dropdown-menu">
									  <li><a class="gametype_filter" id="all" href="#">All Game Types</a></li>
									  <li><a class="gametype_filter" id="NORMAL" href="#">Normal 5v5</a></li>
									  <li><a class="gametype_filter" id="NORMAL_3x3" href="#">Normal 3v3</a></li>
									  <li><a class="gametype_filter" id="RANKED_SOLO_5x5" href="#">Ranked Solo Queue</a></li>
									  <li><a class="gametype_filter" id="RANKED_TEAM_5x5" href="#">Ranked Team 5v5</a></li>
									  <li><a class="gametype_filter" id="RANKED_TEAM_3x3" href="#">Ranked Team 3v3</a></li>
									  <li><a class="gametype_filter" id="ODIN_UNRANKED" href="#">Dominion</a></li>
								  </ul>
							  </div><!-- Gamerange and gametype filters -->
						  </div>
					  </div>
				  </div> <!-- //span5 -->
				  <div class="row-fluid">
					  <div class="span12">
						  <h2><span id="pie_title"></span>Most Played</h2>
						  <div id="pie" class="">
							  <svg></svg>
						  </div>
					  </div>
				  </div> <!-- /Pie div -->
			  </div> <!--/tab #row_champs--->
			</div><!-- /all tab content container -->
	</div> <!-- second row -->
			  
			  
				
				
			<hr>
			<footer class="footer">
				<form class="form-inline" action="https://www.paypal.com/cgi-bin/webscr" method="post">
				&copy; <a href="http://www.github.com/RossHamish" target="_blank" title="github.com/RossHamish">RossHamish</a> 2012-<?php echo date("Y") ?> | Powered by <a href="http://www.elophant.com" target="_blank" title="elophant.com">elophant.com</a>
				&nbsp&nbsp&nbsp&nbsp
				<input type="hidden" name="cmd" value="_s-xclick">
				<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
				">
				<input class="pull-right" type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
				<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
				</form>
			</footer>
		</div> <!--/.fluid-container-->
			
<!-- Scripts -->
<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script type="text/javascript" src="http://html5shim.googlecode.com/svn/trunk/html5.js">
	  </script>
    <![endif]-->
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js">
</script>
<script type="text/javascript" src="jquery.powertip/jquery.powertip.js">
</script>
<script type="text/javascript" src="bootstrap/js/bootstrap.min.js">
</script>
<script type="text/javascript" src="checkboxes.js">
</script>
<script type="text/javascript" src="http://d3js.org/d3.v2.js">
</script>
<script type="text/javascript" src="pie.js">
</script>
<script type="text/javascript" src="grapher.js">
</script>
<script type="text/javascript" src="button_bindings.js">
</script>
<script type="text/javascript" src="js/jquery.prettyLoader.js" charset="utf-8">
</script>
<!-- on_load MUST be defined AFTER grapher.js so that the checkboxes can inherit the same colors as the graph filters -->
<script type="text/javascript" src="on_load.js">
</script>
<!-- prettyLoader initialization (this is the loading box next to the cursor) -->
<script type="text/javascript" charset="utf-8">
	$(document).ready(function(){
		$.prettyLoader({
			animation_speed: 'fast', /* fast/normal/slow/integer */
			bind_to_ajax: true, /* true/false */
			delay: false, /* false OR time in milliseconds (ms) */
			loader: 'images/prettyLoader/ajax-loader.gif', /* Path to your loader gif */
			offset_top: 13, /* integer */
			offset_left: 10 /* integer */
		});
	});
</script>

<!-- Less -->
<link rel="stylesheet/less" type="text/css" href="less/variables.less">
<link rel="stylesheet/less" type="text/css" href="less/bootswatch.less">
<script type="text/javascript" src="less/less-1.3.1.min.js"></script>

<!-- Favicon -->
<link rel="shortcut icon" href="/favicon.ico?v=2">
	
<!-- Check IE -->
<script type="text/javascript" src="check_ie.js">
</script>
			</body>
			</html>