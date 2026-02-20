<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

echo "--- DB Connection Info ---\n";
echo "Default Connection: " . Config::get('database.default') . "\n";
echo "Host: " . Config::get('database.connections.mysql.host') . "\n";
echo "Database: " . Config::get('database.connections.mysql.database') . "\n";
echo "User: " . Config::get('database.connections.mysql.username') . "\n";

echo "\n--- Tables ---\n";
try {
    $tables = DB::select('SHOW TABLES');
    echo "Found " . count($tables) . " tables.\n";
    foreach ($tables as $t) {
        $props = get_object_vars($t);
        echo "- " . reset($props) . "\n";
    }
} catch (\Exception $e) {
    echo "Error listing tables: " . $e->getMessage() . "\n";
}

echo "\n--- Migrations Table ---\n";
try {
    if (Schema::hasTable('migrations')) {
        $count = DB::table('migrations')->count();
        echo "Migrations table exists. Rows: $count\n";
    } else {
        echo "Migrations table DOES NOT exist.\n";
    }
} catch (\Exception $e) {
    echo "Error checking migrations: " . $e->getMessage() . "\n";
}
