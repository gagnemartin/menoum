@extends('layouts.app')

@section('content')
    <div class="container">
        @if ($errors->has('username'))
            <span class="help-block">
            <strong>{{ $errors->first('username') }}</strong>
        </span>
        @endif
        @if ($errors->has('email'))
            <span class="help-block">
            <strong>{{ $errors->first('email') }}</strong>
        </span>
        @endif
        @if ($errors->has('password'))
            <span class="help-block">
            <strong>{{ $errors->first('password') }}</strong>
        </span>
        @endif
        <form class="form-basic" method="POST" action="{{ route('register') }}">
            <h1 class="h3 mb-3 font-weight-normal">Register</h1>

            <label for="username" class="sr-only">Username</label>
            <input id="username" type="text" class="form-control" name="username" value="{{ old('username') }}" placeholder="Username" required autofocus>

            {{ csrf_field() }}

            <label for="email" class="sr-only">Email Address</label>
            <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" placeholder="Email Address" required>

            <label for="password" class="sr-only">Password</label>
            <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required>

            <label for="confirmPassword" class="sr-only">Confirm Password</label>
            <input type="password" name="password_confirmation" id="confirmPassword" class="form-control" placeholder="Confirm Password" required>

            <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </form>
    </div>
@endsection
