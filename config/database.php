<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for all database work. Of course
    | you may use many connections at once using the Database library.
    |
    */

    'default' => env('DB_CONNECTION', 'pgsql'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the database connections setup for your application.
    | Of course, examples of configuring each database platform that is
    | supported by Laravel is shown below to make development simple.
    |
    |
    | All database work in Laravel is done through the PHP PDO facilities
    | so make sure you have the driver for your particular database of
    | choice installed on your machine before you begin development.
    |
    */

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
        ],
        
        'mysql' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'host' => env('DB_HOST', '52.200.30.181'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'enlinea24-7'),
            'username' => env('DB_USERNAME', 'admdb'),
            'password' => env('DB_PASSWORD', 'ownerenlidb%2709'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],

        'enlinea' => [
            'driver' => 'pgsql',
            'host' => env('ENLINEA_HOST', 'localhost'),
            'port' => env('ENLINEA_PORT', '5432'),
            'database' => env('ENLINEA_DATABASE', 'enlinea'),
            'username' => env('ENLINEA_USERNAME', 'postgres'),
            'password' => env('ENLINEA_PASSWORD', 'smainn2328'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],

        'enlinea2' => [
            'driver' => 'pgsql',
            'host' => env('ENLINEA2_HOST', 'localhost'),
            'port' => env('ENLINEA2_PORT', '5432'),
            'database' => env('ENLINEA2_DATABASE', 'enlinea2'),
            'username' => env('ENLINEA2_USERNAME', 'postgres'),
            'password' => env('ENLINEA2_PASSWORD', 'smainn2328'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],

        'enlinea3' => [
            'driver' => 'pgsql',
            'host' => env('ENLINEA3_HOST', 'localhost'),
            'port' => env('ENLINEA3_PORT', '5432'),
            'database' => env('ENLINEA3_DATABASE', 'enlinea3'),
            'username' => env('ENLINEA3_USERNAME', 'postgres'),
            'password' => env('ENLINEA3_PASSWORD', 'smainn2328'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],

        'test' => [
            'driver' => 'pgsql',
            'host' => env('TEST_HOST', 'localhost'),
            'port' => env('TEST_PORT', '5432'),
            'database' => env('TEST_DATABASE', 'pruebah'),
            'username' => env('TEST_USERNAME', 'postgres'),
            'password' => env('TEST_PASSWORD', 'smainn2328'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],       

        'principal' => [
            'driver' => 'pgsql',
            'host' => env('PRINCIPAL_HOST', 'localhost'),
            'port' => env('PRINCIPAL_PORT', '5432'),
            'database' => env('PRINCIPAL_DATABASE', 'cliente'),
            'username' => env('PRINCIPAL_USERNAME', 'postgres'),
            'password' => env('PRINCIPAL_PASSWORD', 'smainn2328'),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],

        'testclient' => [
            'driver' => 'pgsql',
            'host' => '52.200.30.181',
            'port' => '5432',
            'database' => 'testclient',
            'username' => 'admdb',
            'password' => 'ownerenlidb%2709',
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'schema' => 'public',
            'sslmode' => 'prefer',
        ],

        'sqlsrv' => [
            'driver' => 'sqlsrv',
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '1433'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
        ],

        'server' => [
            'driver' => 'pgsql',
            'host' => env('SERVER_HOST', 'localhost'),
            'port' => env('SERVER_PORT', '1433'),
            'database' => env('SERVER_DATABASE', 'forge'),
            'username' => env('SERVER_USERNAME', 'forge'),
            'password' => env('SERVER_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
        ],
        
    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run in the database.
    |
    */

    'migrations' => 'migrations',

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer body of commands than a typical key-value system
    | such as APC or Memcached. Laravel makes it easy to dig right in.
    |
    */

    'redis' => [

        'client' => 'predis',

        'default' => [
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', 6379),
            'database' => env('REDIS_DB', 0),
        ],

        'cache' => [
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', 6379),
            'database' => env('REDIS_CACHE_DB', 1),
        ],

    ],

];
