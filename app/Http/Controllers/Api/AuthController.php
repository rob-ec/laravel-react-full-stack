<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use \Illuminate\Http\Response;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request): Response|ResponseFactory
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response(
                content: [
                    'message' => 'Provided email address or password is incorrect'
                ],
                status: 401
            );
        }

        /** @var User */
        $user = Auth::user();
        $token = $user->createToken($request->userAgent() ?? 'main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function logout(Request $request): Response|ResponseFactory
    {
        /** @var User */
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response(content: '', status: 204);
    }

    public function signup(SignupRequest $request): Response|ResponseFactory
    {
        $data = $request->validated();

        /** @var User */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }
}
