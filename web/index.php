<?php

require('../vendor/autoload.php');
echo "Hey there big man";
$app = new Silex\Application();
$app['debug'] = true;

// Register the monolog logging service
$app->register(new Silex\Provider\MonologServiceProvider(), array(
  'monolog.logfile' => 'php://stderr',
));

//connect to pgsl db
$dbopts = parse_url(getenv('DATABASE_URL'));
$app->register(new Csanquer\Silex\PdoServiceProvider\Provider\PDOServiceProvider('pdo'),
  array(
    'pdo.server' => array(
      'driver' => 'pgsl',
      'user' => $dbopts["user"],
      'password' => $dbopts["pass"],
      'host' => $dbopts["host"],
      'port' => $dbopts["port"],
      'dbname' => ltrim($dbopts["path"],'/')
    )
  )
);

//test query
$app->get('/db/', function() use($app) {
  $st = $app['pdo']->prepare('SELECT filePath FROM imgRepo');
  $st->execute();

  $names = array();
  while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
    $app['monolog']->addDebug('Row ' . $row['filePath']);
    $names[] = $row;
  }

  return $app['twig']->render('database.twig', array(
    'names' => $names
  ));
});

//Register view rendering
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

// Our web handlers

$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return $app['twig']->render('layout.twig'); //changed from index.twig
});

$app->run();
