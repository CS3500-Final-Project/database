<?php
include('index.php');
/*function dbconnect(){
  $dbopts = parse_url(getenv('DATABASE_URL'));
  $db  = new Csanquer\Silex\PdoServiceProvider\Provider\PDOServiceProvider('pdo'),
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
}
$app->get('/db/', function() use($app) {
  $st = $app['pdo']->prepare('SELECT * FROM uploadinfo');
  $st->execute();

  $images = array();
  while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $app['monolog']->addDebug('Row ' . $row['id']);
    $images[] = $row;
  }
  return $app['twig']->render('admindata.twig', array(
    'images' => $images
  ));
});


if (
  strcasecmp($_SERVER['REQUEST_METHOD'], "POST") != 0
) {
  throw new Exception("Request method must be POST");
}
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
$st = $app['pdo']->prepare('INSERT INTO uploadinfo (url, user) VALUES (:url , :user)');
$st->bindParam(':url', $requestBody['url']);
$st->bindParam(':user', 'dadminplatinumplus');
$st->execute();
echo 'got this far';

 ?>
