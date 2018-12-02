<?php

require('../vendor/autoload.php');
use Symfony\Component\HttpFoundation\Request;
//session start goes here?
session_start();
//app and var decs
  //check to see if user is logged in
function loggedIn () {
  if( is_null($_SESSION['username']) ){
    return false;
  }else if( isset($_SESSION['username']) )
    return true;
  else{
    return "crap";
  }
}
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
    $responseData = array();

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
      $title = $requestBody['imageDetails']['title'];
      $description = $requestBody['imageDetails']['description'];
      $tag1 = $requestBody['imageDetails']['tag1'];
      $tag2 = $requestBody['imageDetails']['tag2'];
      $tag3 = $requestBody['imageDetails']['tag3'];
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
$app->post('/create/', function( Request $request ) use ($app){
  $responseData = array();
  $messages = array();
  $contentType = isset($_SERVER['CONTENT_TYPE'])
    ? trim($_SERVER['CONTENT_TYPE'])
    : "";
  if (
    strcasecmp($contentType, "application/json") != 0
  ) {
    throw new Exception("Content type must be application/json");
  }

  $requestBody = json_decode(
    $request->getContent(),
    true
  );

  //check to see if username or displayName already exists in datase and return errors
  $st = $app['pdo']->prepare('SELECT * FROM accountinfo WHERE username = :username');
  $st->bindParam(':username', $username);
  $username = $requestBody['username'];
  $st->execute();
  $userExists = $st->fetch(PDO::FETCH_ASSOC);

  if( $userExists == 0 || $userExists == '0' ){
    //----------------------------- MAKE SURE THEIR INFO IS NOT VALID!!!!---------------------------------------------------------------------------
    //insert user into db, START SESSION and ROUTE TO ACCOUNT DETAILS
    $st = $app['pdo']->prepare('INSERT INTO accountinfo (username, password, bio, displayname) VALUES (:username, :password, :bio, :displayname)');
    $st->bindParam(':username',$requestBody['username']);
    $st->bindParam(':password',$requestBody['password']);
    $st->bindParam(':bio',$requestBody['bio']);
    $st->bindParam(':displayname',$requestBody['displayName']);
    $st->execute();

    $_SESSION['user'] = $requestBody['username'];
    return $requestBody['username'];
  }
  else{  //otherwise return success or route to account details
    return false;
  }
//return $app->json($userExists);
});

//--------------------user login-----------------------------
$app->post('/login/', function(Request $request) use($app){
  $responseData = array();
  $messages = array();
  $contentType = isset($_SERVER['CONTENT_TYPE'])
    ? trim($_SERVER['CONTENT_TYPE'])
    : "";
  if (
    strcasecmp($contentType, "application/json") != 0
  ) {
    throw new Exception("Content type must be application/json");
  }

  $requestBody = json_decode(
    $request->getContent(),
    true
  );

  $st = $app['pdo']->prepare('SELECT * FROM accountinfo WHERE username = :username AND password = :password');
  $st->bindParam(':username', $requestBody['username']);
  $st->bindParam(':password', $requestBody['password']);
  $st->execute();
  $result = $st->fetch(PDO::FETCH_ASSOC);

  if($result == 0 || $result == '0'){
    return false;
  }else{
    $_SESSION['username'] = $result['username'];
    return json_encode(array(
        "uid"=>$result['uid'],
        "username"=>$result['username'],
        "bio"=>$result['bio'],
        "displayname"=>$result['displayname']
    ));
  }
});

//---------------account details server call---------------
$app->get('/account-details/{user}', function($user) use($app) {
  $st = $app['pdo']->prepare('SELECT * FROM accountinfo WHERE username = :user');
  $st->bindParam(':user', $user);
  $st->execute();
  $userinfo = $st->fetch(PDO::FETCH_ASSOC);
  //now grab pics
  $st = $app['pdo']->prepare('SELECT * FROM uploadinfo WHERE username = :user');
  $st->bindParam(':user', $user);
  $st->execute();
  $images = array();
  while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    //$app['monolog']->addDebug('Row ' . $row['id']);
    $images[] = $row;
  }


  if($userinfo == 0 || $userinfo == '0'){
    return "Could Not Find User " . $user . " In Database";
  }else{
    return json_encode(array(
        "uid"=>$userinfo['uid'],
        "username"=>$userinfo['username'],
        "bio"=>$userinfo['bio'],
        "displayname"=>$userinfo['displayname'],
        "images"=>$images
    ));
  }
});

/* ----------------------Personal account editing? ----------------------------
$app->post('/account-details/', function( Request $request ) use($app){
  $responseData = array();
  $messages = array();
  $contentType = isset($_SERVER['CONTENT_TYPE'])
    ? trim($_SERVER['CONTENT_TYPE'])
    : "";
  if (
    strcasecmp($contentType, "application/json") != 0
  ) {
    throw new Exception("Content type must be application/json");
  }
  $requestBody = json_decode(
    $request->getContent(),
    true
  );

  //return json with their account info and the images they have uploaded
  $st = $app['pdo']->prepare('SELECT * FROM accountinfo WHERE username = :username');
  $st->bindParam(':username', $_SESSION['username']);
  $st->execute();
  $result = $st->fetch(PDO::FETCH_ASSOC);
  //images
  $st = $app['pdo']->prepare('SELECT * FROM uploadinfo WHERE username = :username');
  $st->bindParam(':username', $_SESSION['username']);
  $images = array();
  while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $app['monolog']->addDebug('Row ' . $row['id']);
    $images[] = $row;
  }

  if($result == 0 || $result == '0'){
    //this means no one is logged in
    return false;
  }else{

    return json_encode(array(
        "uid"=>$result['uid'],
        "username"=>$result['username'],
        "bio"=>$result['bio'],
        "displayname"=>$result['displayname'],
        "images"=>$images
    ));
  }
});
*/

//---------------------------------------------------------------------------REDIRECTS---------------------------------------------------------------
//account details, find their posts
//$app->post('',)
//direct to login or account details
$app->get('/account/', function() use ($app){
  //if no session go to login.php
  if( is_null($_SESSION['username']) ){
    return $app->redirect('../account-pages/account/login.html');
  }
  return $app->redirect('../account-pages/account/details.html');
  //otherwise go to accountDetails

});

//upload redirect
/*
$app->get('/upload/', function () use ($app){
  if(loggedIn()){ return $app->redirect('./account-pages/html') }
  return $app->redirect('./upload.html');
});
*/

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



$app->run();
