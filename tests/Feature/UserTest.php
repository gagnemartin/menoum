<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserTest extends TestCase
{
    use RefreshDatabase;

//    public function testDatabase()
//    {
//        $this->assertDatabaseHas('users', ['email']);
//    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testExample()
    {
        $user = factory(User::class)->create([
            'password' => $password = bcrypt('fake-user')
        ]);

        $response = $this->json('POST', '/api/login', [
            'username' => $user->username,
            'password' => 'fake-user'
        ], ['Accept' => 'application/json']);
        //dump($response);

        $response->assertStatus(200);
    }
}
