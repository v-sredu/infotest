<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class GroupController extends Controller
{
    public function getGroups()
    {
        $groups = Group::all();
        return response()->json($groups, 200);
    }

    public function addGroup(Request $request)
    {
        // Валидация входящих данных
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:20|unique:groups,name',
        ]);

        if ($validator->fails())
        {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Создание записи
        $group = Group::create([
            'name' => $request->name
        ]);

        return response()->json([
            'message' => 'Группа успешно создана',
            'group' => $group
        ], 201);
    }
}
