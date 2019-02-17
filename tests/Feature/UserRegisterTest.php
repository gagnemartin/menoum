<?php

namespace Tests\Feature;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserRegisterTest extends TestCase
{
    use RefreshDatabase;

    public function setUp() {
        parent::setUp();
        $this->artisan('passport:install');
    }

    public function testUserDataMissing()
    {
        $response = $this->json('POST', route('user.store'));
        $response->assertStatus(422);
    }

    public function testUserUsernameIsNotAlphanumeric()
    {
        $user = factory(User::class)->make(
            ['username' => 'asd(4;s']
        );

        $response = $this->json('POST', route('user.store'), [
            'username' => $user->username,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password,
        ]);
        $response->assertStatus(422);
    }

    public function testUserPasswordConfirmationWrong()
    {
        $user = factory(User::class)->make();

        $response = $this->json('POST', route('user.store'), [
            'username' => $user->username,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->username,
        ]);
        $response->assertStatus(422);
    }

    public function testCanCreateAccessToken()
    {
        $user = factory(User::class)->create();
        $token = $user->createToken('TestToken')->accessToken;

        $this->assertTrue(gettype($token) === 'string');

    }

    public function testUserCanRegister()
    {
        $user = factory(User::class)->make();

        $response = $this->json('POST', route('user.store'), [
            'username' => $user->username,
            'email' => $user->email,
            'password' => $user->password,
            'password_confirmation' => $user->password,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token']);

        $this->assertDatabaseHas('users', [
            'username' => $user->username,
            'email' => $user->email
        ]);
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserCantAccessRegisterWhenAuthenticated()
    {
        $user = factory(User::class)->make();

        $response = $this->actingAs($user, 'api')->json('POST', route('user.store'));
        $response->assertStatus(302);
    }
}
