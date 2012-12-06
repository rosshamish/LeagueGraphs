<html>
  <head>
    <?php
      require_once('sensitive_data.php');
      require_once('PhpConsole.php');
      PhpConsole::start();
      
      /**
       * Allowed parameters:
       *  n - summoner name (string)
       *  c - champion id (int)
       *  r - game range (int)
       *  f - filters (json arr)
       *  t - gameType (string)
       */
      
       
      /* Connect to the db so that we can use real_escape_string */
      $mysqli = new mysqli($host, $username, $password);
      $mysqli->select_db($database);
      
      /* Set default params */
      $summoner_name = 'SomePlayer';
      $champId = '';
      $gameRange = 50000;
      $filters = '["championsKilled"]';
      $gameType = '';
      
      /* Get the passed params */ 
      foreach ($_GET as $key => $value) {
        debug("key: $key, value: $value");
        switch ($key) {
          case 'n': // summoner_name
            $summoner_name = $value;
            break;
          case 'c': // champId
            $champId = $value;
            break;
          case 'r': // gameRange
            $gameRange = $value;
            break;
          case 'f': // filters
            $filters = $value;
            break;
          case 't': // gameType
            $gameType = $value;
            break;
        }
      }
      debug('summoner_name: ' . $summoner_name);
      /* Close the connection */
      $mysqli->close();
      ?>
      
      
      <!-- Set the session variables with js -->
      <script type="text/javascript">
        sessionStorage.share = 'true';
        sessionStorage.summoner_name = '<?php echo $summoner_name ?>';
        sessionStorage.champId = '<?php echo $champId ?>';
        sessionStorage.gameRange = '<?php echo $gameRange ?>';
        sessionStorage.filters = '<?php echo $filters ?>';
        console.log('share: ' + sessionStorage.share);
        sessionStorage.gameType = '<?php echo $gameType ?>';
      </script>
      
      <?php      
        echo '<META HTTP-EQUIV="Refresh" Content="0; URL=index.html">';
      ?>
  </head>
</html>
