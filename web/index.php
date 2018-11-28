<?php
//include 'layout.html';
require('../vendor/autoload.php');
$app = new Silex\Application();
$app['debug'] = true;
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


$app->post(
  '/upload-image/',
  function () use($app)
  {
    $responseData = array();
    $messages = array();
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
/*
    if( is_null( $app ) ) {
      array_push($message, 'app is null');
      //echo 'app doesnt exist';
    }
    else if( isset( $app['pdo'] ) ) {
      array_push($message, 'app pdo is set');
      //echo 'pdo exists';
    }
    else
      array_push($message, 'pdo is null');
      //echo 'pdo doesnt exist!';
    }
*/
      $requestBody['url'] = stripcslashes($requestBody['url']);

      $st = $app['pdo']->prepare( "INSERT INTO uploadinfo ( url, username ) VALUES ( :url , :user )" );
      $st->bindParam(':url', $url);
      $st->bindParam(':user', $user);
      $url = $requestBody->url;
      $user = 'admin';

      $st->execute();

      //$responseData( 'messages' => $messages );


    //return $app->json( $content );
    return $app->json( $requestBody );
    //return $app->json( array('Status' => 'Success') );
  }
);

//test query
/* $app->get('/db/', function() use($app) {
  $st = $app['pdo']->prepare('SELECT name FROM test_table');
  $st->execute();

  $names = array();
  while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $app['monolog']->addDebug('Row ' . $row['name']);
    $names[] = $row;
  }

  return $app['twig']->render('database.twig', array(
    'names' => $names
  ));
}); */

//admin data view
/*
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
//try upload?
//$app->get('/up', function() use($app) {
//  $app['monolog']->addDebug('logging output.');
//  return $app['twig']->render('upload.twig'); //changed from index.twig
//});

//Register view rendering
//$app->register(new Silex\Provider\TwigServiceProvider(), array(
//    'twig.path' => __DIR__.'/views',
//));

// Our web handlers

//$app->get('/', function() use($app) {
  //run query to grab most popular
//  $app['monolog']->addDebug('logging output.');
//  return $app['twig']->render('index.twig'); //changed from index.twig
//});

$app->run();
