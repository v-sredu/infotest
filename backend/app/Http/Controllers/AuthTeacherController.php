<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthTeacherController extends Controller
{
    // РЕГИСТРАЦИЯ
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:20",
            "surname" => "required|string|max:20",
            "email" => "required|email|max:30|unique:teachers",
            "password" => "required|min:6|same:confirm_password",
        ]);

        if ($validator->fails()) {
            return response()->json(["errors" => $validator->errors()->all()], 422);
        }

        $teacher = Teacher::create([
            "name" => $request->name,
            "surname" => $request->surname,
            "email" => $request->email,
            "password" => Hash::make($request->password)
        ]);

        // 201 - Ресурс успешно создан
        return response()->json([
            'user' => [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'surname' => $teacher->surname,
                'email' => $teacher->email,
                'token' => $teacher->createToken('auth')->plainTextToken,
                'role' => 'teacher'
            ],
        ], 201);
    }

    // ЛОГИН
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], 422);
        }

        $teacher = Teacher::where('email', $request->email)->first();

        if (!$teacher || !Hash::check($request->password, $teacher->password)) {
            return response()->json(['errors' => ['Неверный email или пароль']], 401);
        }

        // 200 - Успешный вход
        return response()->json([
            'user' => [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'surname' => $teacher->surname,
                'email' => $teacher->email,
                'token' => $teacher->createToken('auth')->plainTextToken,
                'role' => 'teacher'
            ],
        ], 200);
    }

    // ПРОФИЛЬ (обновление данных)
    public function profile(Request $request)
    {
        $teacher = $request->user();

        if (!$teacher) {
            // 401 - Не авторизован
            return response()->json(['errors' => ['Не авторизован']], 401);
        }

        $validator = Validator::make($request->all(), [
            "name" => "sometimes|nullable|string|max:20",
            "surname" => "sometimes|nullable|string|max:20",
            "email" => "sometimes|nullable|email|unique:teachers,email," . $teacher->id,
            "password" => "sometimes|nullable|min:6|same:confirm_password",
        ]);

        if ($validator->fails()) {
            return response()->json(["errors" => $validator->errors()->all()], 422);
        }

        if ($request->filled('name')) $teacher->name = $request->name;
        if ($request->filled('surname')) $teacher->surname = $request->surname;
        if ($request->filled('email')) $teacher->email = $request->email;
        if ($request->filled('password')) $teacher->password = Hash::make($request->password);

        $teacher->save();

        return response()->json([
            'user' => [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'surname' => $teacher->surname,
                'email' => $teacher->email,
                'token' => $request->bearerToken(),
                'role' => 'teacher'
            ],
        ], 200);
    }

    // ВЫХОД
    public function logOut(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Выход выполнен'], 200);
    }
}
