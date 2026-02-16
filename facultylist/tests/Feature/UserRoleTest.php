<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;
use App\Http\Middleware\RoleMiddleware;

class UserRoleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Define route for testing middleware if not already registered (it should be though)
    }

    public function test_user_roles_methods(): void
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $faculty = User::factory()->create(['role' => 'Faculty']);

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($admin->isFaculty());

        $this->assertFalse($faculty->isAdmin());
        $this->assertTrue($faculty->isFaculty());
    }

    public function test_role_middleware_restricts_access(): void
    {
        Route::get('/admin-only', function () {
            return 'Admin Access';
        })->middleware('role:Admin');

        $admin = User::factory()->create(['role' => 'Admin']);
        $faculty = User::factory()->create(['role' => 'Faculty']);

        // Admin should access
        $this->actingAs($admin)
            ->get('/admin-only')
            ->assertStatus(200)
            ->assertSee('Admin Access');

        // Faculty should be forbidden
        $this->actingAs($faculty)
            ->get('/admin-only')
            ->assertStatus(403);
    }
}
