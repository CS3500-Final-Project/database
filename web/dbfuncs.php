<?php
function dbconnect(){
  $dbopts = parse_url(getenv('DATABASE_URL'));
  $app->register(new Csanquer\Silex\PdoServiceProvider\Provider\PDOServiceProvider('pdo'),
                 array(
                  'pdo.server' => array(
                     'driver'   => 'pgsql',
                     'user' => $dbopts["user"],
                     'password' => $dbopts["pass"],
                     'host' => $dbopts["host"],
                     'port' => $dbopts["port"],
                     'dbname' => ltrim($dbopts["path"],'/')
                     )
                 )
  );
}
 ?>
