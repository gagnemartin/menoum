<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Lcobucci\JWT\Parser;

class UserController extends Controller
{
    public $successStatus = 200;

    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|alpha_num|max:16|unique:users',
            'email' => 'required|string|email|max:191|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        if ($user) {
            $credentials = [
                'username' => $data['username'],
                'password' => $data['password']
            ];
            return $this->getToken($credentials);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');

        return $this->getToken($credentials);
    }

    public function logout(Request $request)
    {
        $value = $request->bearerToken();
        $id = (new Parser())->parse($value)->getHeader('jti');
        $token = $request->user()->tokens->find($id);
        $token->revoke();

        $response = 'Logged out!';

        return response($response, $this->successStatus);
    }

    private function getToken(array $credentials)
    {
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token =  $user->createToken('Menoum')->accessToken;

            return response()->json(['token' => $token], $this->successStatus);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }
}
