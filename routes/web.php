<?php

use Illuminate\Support\Facades\Route;

// 👇 Al final de todo
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$'); 