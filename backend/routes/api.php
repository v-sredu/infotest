<?php

use App\Http\Controllers\AuthStudentController;
use App\Http\Controllers\AuthTeacherController;
use App\Http\Controllers\GroupController;
use Illuminate\Support\Facades\Route;

Route::prefix("student")->group(function()
{
    Route::post("register", [
        AuthStudentController::class,
        "register"
    ]);
    Route::post("login", [
        AuthStudentController::class,
        "login"
    ]);
    Route::middleware('auth:sanctum')->group(function()
    {
        Route::post('profile', [
            AuthStudentController::class,
            'profile'
        ]);
        Route::post('logOut', [
            AuthStudentController::class,
            'logOut'
        ]);
    });
});

Route::prefix("teacher")->group(function()
{
    Route::post("register", [
        AuthTeacherController::class,
        "register"
    ]);
    Route::post("login", [
        AuthTeacherController::class,
        "login"
    ]);
    Route::middleware('auth:sanctum')->group(function()
    {
        Route::post('profile', [
            AuthTeacherController::class,
            'profile'
        ]);
        Route::post('logOut', [
            AuthTeacherController::class,
            'logOut'
        ]);
    });
});

Route::get("groups", [GroupController::class, "getGroups"]);
