<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "Disabling constraints...\n";
Schema::disableForeignKeyConstraints();

echo "Getting tables...\n";
echo "Getting tables...\n";
$tables = DB::select('SHOW TABLES');
echo "Found " . count($tables) . " tables.\n";

foreach ($tables as $table) {
    $props = get_object_vars($table);
    $name = reset($props);

    echo "Dropping $name...\n";
    Schema::dropIfExists($name);
}

Schema::enableForeignKeyConstraints();
echo "Done.\n";
