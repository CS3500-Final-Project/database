<?php
//include 'layout.html';
require('../vendor/autoload.php');
require('dbfuncs.php');
$app = new Silex\Application();
$app['debug'] = true;
//$app['debug'] = false;

// Register the monolog logging service
$app->register(new Silex\Provider\MonologServiceProvider(), array(
  'monolog.logfile' => 'php://stderr',
));

//connect to pgsl db
dbconnect();

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
$app->get('/up', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return $app['twig']->render('upload.twig'); //changed from index.twig
});

//Register view rendering
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

// Our web handlers

$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return $app['twig']->render('index.twig'); //changed from index.twig
});

$app->run();
