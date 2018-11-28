<?php
include('index.php');
$var = 'hello satan';
/*require('../vendor/autoload.php');
$dbup = new Silex\Application();
$dbup['debug'] = true;
//$app['debug'] = false;

// Register the monolog logging service
$app->register(new Silex\Provider\MonologServiceProvider(), array(
  'monolog.logfile' => 'php://stderr',
));

//connect to pgsl db
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
*/
// make sure that the content type of the request
// has been seet to application/json
$contentType = isset($_SERVER['CONTENT_TYPE'])
  ? trim($_SERVER['CONTENT_TYPE'])
  : ""
;

if (
  strcasecmp($contentType, "application/json") != 0
) {
  throw new Exception("Content type must be application/json");
}

$content = trim(
  file_get_contents("php://input")
);

// attempt to decode the RAW post data
// from JSON into an associative array
$requestBody = json_decode($content, true);
if( is_null( $app ) ) {
  echo "app is null";
}
else if( isset( $app['pdo'] ) ) {
  echo "app pdo is set";
}
else{
  echo "pdo is null";
}

  $st = $app['pdo']->prepare('INSERT INTO uploadinfo (url, user) VALUES (:url , :user)');
  $st->bindParam(':url', $requestBody['url']);
  $st->bindParam(':user', 'dadminplatinumplus');
  $st->execute();


echo 'got this far';

 ?>
