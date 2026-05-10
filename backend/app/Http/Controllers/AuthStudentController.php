<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthStudentController extends Controller
{
    // РЕГИСТРАЦИЯ
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:20",
            "surname" => "required|string|max:20",
            "group_id" => "required|exists:groups,id",
            "email" => "required|email|max:30|unique:students",
            "password" => "required|min:6|same:confirm_password",
        ]);
        if ($validator->fails()) {
            return response()->json(["errors" => $validator->errors()->all()], 422);
        }

        $student = Student::create([
            "name" => $request->name,
            "surname" => $request->surname,
            "email" => $request->email,
            "group_id" => $request->group_id,
            "password" => Hash::make($request->password)
        ]);

        return response()->json([
            'user' => [
                'id' => $student->id,
                'name' => $student->name,
                'surname' => $student->surname,
                'email' => $student->email,
                'group_id' => $student->group_id,
                'token' => $student->createToken('auth')->plainTextToken,
                'role' => 'student'
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

        $student = Student::where('email', $request->email)->first();

        if (!$student || !Hash::check($request->password, $student->password)) {
            return response()->json(['errors' => ['Неверный email или пароль']], 401);
        }

        // 200 OK — успешный вход
        return response()->json([
            'user' => [
                'id' => $student->id,
                'name' => $student->name,
                'surname' => $student->surname,
                'email' => $student->email,
                'group_id' => $student->group_id,
                'token' => $student->createToken('auth')->plainTextToken,
                'role' => 'student'
            ],
        ], 200);
    }

    // ПРОФИЛЬ
    public function profile(Request $request)
    {
        $student = $request->user();

        if (!$student) {
            return response()->json(['errors' => ['Не авторизован']], 401);
        }

        $validator = Validator::make($request->all(), [
            "name" => "sometimes|nullable|string|max:20",
            "surname" => "sometimes|nullable|string|max:20",
            "group_id" => "sometimes|nullable|exists:groups,id",
            "email" => "sometimes|nullable|email|unique:students,email," . $student->id,
            "password" => "sometimes|nullable|min:6|same:confirm_password",
        ]);

        if ($validator->fails()) {
            return response()->json(["errors" => $validator->errors()->all()], 422);
        }

        if ($request->filled('name')) $student->name = $request->name;
        if ($request->filled('surname')) $student->surname = $request->surname;
        if ($request->filled('email')) $student->email = $request->email;
        if ($request->filled('group_id')) $student->group_id = $request->group_id;
        if ($request->filled('password')) $student->password = Hash::make($request->password);

        $student->save();

        return response()->json([
            'user' => [
                'id' => $student->id,
                'name' => $student->name,
                'surname' => $student->surname,
                'email' => $student->email,
                'group_id' => $student->group_id,
                'token' => $request->bearerToken(),
                'role' => 'student'
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
