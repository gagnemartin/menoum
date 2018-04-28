@extends('layouts.app')

@section('content')
    <div class="container">
        @if ($errors->has('username'))
            <span class="help-block">
            <strong>{{ $errors->first('username') }}</strong>
        </span>
        @endif
        @if ($errors->has('password'))
            <span class="help-block">
            <strong>{{ $errors->first('password') }}</strong>
        </span>
        @endif
        <form class="form-basic" method="POST" action="{{ route('login') }}">
            <h1 class="h3 mb-3 font-weight-normal">Login</h1>

            <label for="username" class="sr-only">Username</label>
            <input id="username" type="text" class="form-control" name="username" value="{{ old('username') }}" placeholder="Username" required autofocus>

            {{ csrf_field() }}

            <label for="password" class="sr-only">Password</label>
            <input type="password" name="password" id="password" class="form-control" placeholder="Password" required>

            <div class="checkbox mb-3">
                <label>
                    <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> Remember Me
                </label>
            </div>

            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            <a class="btn btn-link" href="{{ route('password.request') }}">
                Forgot Your Password?
            </a>
        </form>
    </div>
@endsection
