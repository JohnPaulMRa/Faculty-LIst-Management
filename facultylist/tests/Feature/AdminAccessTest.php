<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_faculty_cannot_access_admin_routes(): void
    {
        $faculty = User::factory()->create(['role' => 'Faculty']);

        $this->actingAs($faculty)
            ->get('/admin/dashboard')
            ->assertStatus(403); // Forbidden
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'Admin']);

        $this->actingAs($admin)
            ->get('/admin/dashboard')
            ->assertStatus(200);
    }

    public function test_faculty_redirected_to_dashboard_on_login(): void
    {
        $faculty = User::factory()->create([
            'role' => 'Faculty',
            'password' => bcrypt('password'),
        ]);

        $this->post('/login', [
            'email' => $faculty->email,
            'password' => 'password',
        ])->assertRedirect(route('dashboard'));
    }

    public function test_admin_redirected_to_admin_dashboard_on_login(): void
    {
        $admin = User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'password' => bcrypt('password'),
        ]);

        $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ])->assertRedirect(route('admin.dashboard'));
    }
    public function test_admin_cannot_access_faculty_routes(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)
            ->get('/dashboard')
            ->assertStatus(403);

        $this->actingAs($admin)
            ->get('/facultyprofile')
            ->assertStatus(403);
    }
}
