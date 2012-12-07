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
      
      /* Set default params */
      $summoner_name = 'SomePlayer';
      $champId = '';
      $gameRange = 50000;
      $filters = '["championsKilled"]';
      $gameType = '';
      
      /* Get the passed params */ 
      foreach ($_GET as $key => $value) {
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
      ?>
      
      
      <!-- Set the session variables with js -->
      <script type="text/javascript">
        sessionStorage.share = 'true';
        sessionStorage.summoner_name = '<?php echo $summoner_name ?>';
        sessionStorage.champId = '<?php echo $champId ?>';
        sessionStorage.gameRange = '<?php echo $gameRange ?>';
        sessionStorage.filters = '<?php echo $filters ?>';
        sessionStorage.gameType = '<?php echo $gameType ?>';
        // redirect
        var dir = window.location.pathname;
        var re = '/';
        if (dir.indexOf('dev') == -1) { // production
          re = '/';
        } else { // debug&dev
          re = '/dev/';
        }
        top.location = re;
      </script>
  </head>
</html>
