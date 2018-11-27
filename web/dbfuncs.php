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

*/

$content = trim(
  file_get_contents("php://input")
);

// attempt to decode the RAW post data
// from JSON into an associative array
$requestBody = json_decode($content, true);

echo 'got this far';
print_r($requestBody);
 ?>
