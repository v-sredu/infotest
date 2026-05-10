<?php

use App\Http\Controllers\AuthStudentController;
use App\Http\Controllers\AuthTeacherController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

Route::prefix("teacher")->group(function () {
    Route::post("register", [
        AuthTeacherController::class,
        "register"
    ]);
    Route::post("login", [
        AuthTeacherController::class,
        "login"
    ]);
    Route::middleware('auth:sanctum', \App\Http\Middleware\Teacher::class)->group(function () {
        Route::post('test', [
            TestController::class,
            'createTest'
        ]);
        Route::put('test/{id}', [
            TestController::class,
            'updateTest'
        ]);
        Route::delete('test/{id}', [
            TestController::class,
            'deleteTest'
        ]);
        Route::get('tests', [
            TestController::class,
            'getTeacherTests'
        ]);
        Route::get('test/{id}', [
            TestController::class,
            'getTeacherTest'
        ]);
        Route::get('test/{id}/statistics', [
            TestController::class,
            'getTestStatistics'
        ]);
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

Route::prefix("student")->group(function () {
    Route::post("register", [
        AuthStudentController::class,
        "register"
    ]);
    Route::post("login", [
        AuthStudentController::class,
        "login"
    ]);
    Route::middleware('auth:sanctum', \App\Http\Middleware\Student::class)->group(function () {
        Route::post('profile', [
            AuthStudentController::class,
            'profile'
        ]);
        Route::post('logOut', [
            AuthStudentController::class,
            'logOut'
        ]);
        Route::get('tests', [
            TestController::class,
            'getStudentTests'
        ]);
        Route::get('test/{id}', [
            TestController::class,
            'getAvailableTest'
        ]);
        Route::post('test/{id}/submit', [
            TestController::class,
            'verifyTest'
        ]);
    });
});

Route::get("groups", [
    GroupController::class,
    "getGroups"
]);
