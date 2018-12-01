<?php
//include 'layout.html';
require('../vendor/autoload.php');
use Symfony\Component\HttpFoundation\Request;
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

//upload image
$app->post(
  '/upload-image/',
  function ( Request $request ) use($app)
  {
    //redirect to login if they are not logged in
    if( is_null($_SESSION['username']) ){
      return $app->redirect('./account/login.php');
    }
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


    $requestBody = json_decode(
      $request->getContent(),
      true
    );
    /*
    $content = trim(
      file_get_contents("php://input")
    );

    // attempt to decode the RAW post data
    // from JSON into an associative array
    $requestBody = json_decode($content, true);
    */

      $st = $app['pdo']->prepare( "INSERT INTO uploadinfo ( url, username, title, description, tag1, tag2, tag3 )
                                  VALUES ( :url , :user, :title, :description, :tag1, :tag2, :tag3 )" );
      $st->bindParam(':url', $url);
      $st->bindParam(':user', $user);
      $st->bindParam(':title', $title);
      $st->bindParam(':description',$description);
      $st->bindParam(':tag1',$tag1);
      $st->bindParam(':tag2',$tag2);
      $st->bindParam(':tag3',$tag3);

      $url = $requestBody['info']['secure_url'];
      //this needs to be set to current logged in user's username
      $user = 'admin';
      $title = $requestBody['title'];
      $description = $requestBody['description'];
      $tag1 = $requestBody['tag1'];
      $tag2 = $requestBody['tag2'];
      $tag3 = $requestBody['tag3'];
      $st->execute();

    return 'image uploaded, url: ' . $requestBody['info']['secure_url'];

  }
);

//front page
$app->get('/fp/', function() use($app){
  $st = $app['pdo']->prepare('SELECT * FROM uploadinfo');
  $st->execute();

  $images = array();
  while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $app['monolog']->addDebug('Row ' . $row['id']);
    $images[] = $row;
  }
  //$app->json(array('images' => $images));
  return $app->json(array('images' => $images));
});

//user registration
//$app-> post();

//user login
$app->get( '/user-login/', function( Request $request ) use ($app){
  $loginValid = True;

  if($loginValid){
    //if login is successful
    return $app->redirect('./account/account-details.html');
  }else{
    //return error if login is not successful
    return 'Username Or Password Is Invalid';
  }



});

//fp redirect
$app->get(
  '/',
  function() use($app) {
    $app['monolog']->addDebug( 'request to /' );

    return $app->redirect(
      './frontpage.html'
    );
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
/*
//admin data view
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

$app->get('/', function() use($app) {
  //run query to grab most popular
  $app['monolog']->addDebug('logging output.');
  return $app['twig']->render('index.twig'); //changed from index.twig
});
*/
$app->run();
