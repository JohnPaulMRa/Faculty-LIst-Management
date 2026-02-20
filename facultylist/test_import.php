<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::first();
\Illuminate\Support\Facades\Auth::login($user);

$data = [
    'faculty' => [
        [
            'name' => 'John Doe E5',
            'joined_year' => '2023-2024',
            'email' => 'test_e5@test.com',
            'avatar_initials' => 'JD',
            'form_type' => 'E5',
            'status' => 'Updated',
            'employment' => 'Plantilla',
            'fullTimeCode' => '1',
        ]
    ]
];

$request = \Illuminate\Http\Request::create('/faculty/import-e5', 'POST', $data);
$request->setUserResolver(function () use ($user) {
    return $user;
});

echo "Starting import test...\n";
try {
    $controller = app(\App\Http\Controllers\FacultyController::class);
    $response = $controller->bulkStoreE5($request);

    echo "Response Class: " . get_class($response) . "\n";
    if (method_exists($response, 'getStatusCode')) {
        echo "Response Status: " . $response->getStatusCode() . "\n";
    }
    if ($response instanceof \Illuminate\Http\RedirectResponse) {
        $session = session()->all();
        echo "Session errors: " . json_encode($session['errors'] ?? null) . "\n";
        echo "Session success: " . json_encode($session['success'] ?? null) . "\n";
        echo "Session error msg: " . json_encode($session['error'] ?? null) . "\n";
    }
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}

echo "DB count of FacultyE5: " . \App\Models\FacultyE5::count() . "\n";
