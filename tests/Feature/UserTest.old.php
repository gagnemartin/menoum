<?php

namespace Tests\Feature;

use App\User;
use Laravel\Passport\Passport;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function testUserCanRegister()
    {
        $user = factory(User::class)->make();

        $response = $this->post('/api/register', [
            'username' => $user->username,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => $user->email
        ]);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserCanLogin()
    {
        $user = Passport::actingAs(
            factory(User::class)->create([
            'password' => bcrypt('fake-user')
        ]));

        $response = $this->post('/api/login', [
            'username' => $user->username,
            'password' => 'fake-user'
        ]);
        //dump($response);

        $response->assertStatus(200);
    }
}
