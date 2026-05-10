<?php

namespace App\Http\Controllers;

use App\Models\Result;
use App\Models\Task;
use App\Models\Test;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TestController extends Controller
{
    public function createTest(Request $request)
    {
        // 1. Валидация строго по лимитам вашей миграции
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:30',
            'description' => 'required|string|max:500',
            'selected_groups' => 'nullable|array',
            'selected_groups.*' => 'exists:groups,id',
            'tasks' => 'required|array|min:1',
            'tasks.*.question_title' => 'required|string|max:1000',
            'tasks.*.option_a' => 'required|string|max:1000',
            'tasks.*.option_b' => 'nullable|string|max:1000',
            'tasks.*.option_c' => 'nullable|string|max:1000',
            'tasks.*.option_d' => 'nullable|string|max:1000',
            'tasks.*.correct_option' => 'required|in:A,B,C,D',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }
        try {
            return DB::transaction(function () use ($request) {
                // 2. Создание теста
                $test = Test::create([
                    'name' => $request->name,
                    'description' => $request->description,
                    'teacher_id' => $request->user()->id,
                ]);

                // 3. Привязка групп (Pivot table group_test)
                if (!empty($request->selected_groups)) {
                    $test->groups()->attach($request->selected_groups);
                }

                // 4. Создание заданий (Tasks)
                foreach ($request->tasks as $taskData) {
                    Task::create([
                        'test_id' => $test->id,
                        'question_title' => $taskData['question_title'],
                        // Переименовано под БД
                        'option_a' => $taskData['option_a'],
                        'option_b' => $taskData['option_b'] ?? null,
                        'option_c' => $taskData['option_c'] ?? null,
                        'option_d' => $taskData['option_d'] ?? null,
                        'correct_option' => strtoupper($taskData['correct_option']),
                        // К верхнему регистру для ENUM
                    ]);
                }

                // Возвращаем данные для обновления стейта в React
                return response()->json([
                    'id' => $test->id,
                    'name' => $test->name,
                    'description' => $test->description,
                    'tasks' => $test->tasks
                ], 201);
            });

        } catch (Exception $e) {
            return response()->json([
                'errors' => ['Ошибка сервера: ' . $e->getMessage()]
            ], 500);
        }
    }

    public function updateTest(Request $request, $id)
    {
        $test = Test::find($id);

        if (!$test) {
            return response()->json(['message' => 'Тест не найден'], 404);
        }

        if ($test->teacher_id != $request->user()->id) {
            return response()->json(['errors' => ['У вас нет возможности редактировать этот тест, так как вы не является его автором']], 403);
        }

        // 1. Валидация
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:30',
            'description' => 'required|string|max:500',
            'selected_groups' => 'nullable|array',
            'tasks' => 'required|array|min:1',
            'tasks.*.question_title' => 'required|string|max:1000',
            'tasks.*.option_a' => 'required|string|max:1000',
            'tasks.*.correct_option' => 'required|in:A,B,C,D',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()->all()], 422);
        }

        try {
            return DB::transaction(function () use ($request, $test) {

                // 2. Обновляем основные данные теста
                $test->update([
                    'name' => $request->name,
                    'description' => $request->description,
                ]);

                $test->groups()->sync($request->selected_groups ?? []);
                $test->tasks()->delete();

                foreach ($request->tasks as $taskData) {
                    $test->tasks()->create([
                        'question_title' => $taskData['question_title'],
                        'option_a' => $taskData['option_a'],
                        'option_b' => $taskData['option_b'] ?? null,
                        'option_c' => $taskData['option_c'] ?? null,
                        'option_d' => $taskData['option_d'] ?? null,
                        'correct_option' => strtoupper($taskData['correct_option']),
                    ]);
                }

                return response()->json([
                    'id' => $test->id,
                    'name' => $test->name,
                    'description' => $test->description,
                    'tasks' => $test->tasks
                ], 200);
            });
        } catch (Exception $e) {
            return response()->json(['errors' => ['Ошибка при обновлении: ' . $e->getMessage()]], 500);
        }
    }

    public function deleteTest(Request $request, $id)
    {
        $test = Test::find($id);
        if (!$test) {
            return response()->json([
                'message' => 'Тест не найден'
            ], 404);
        }
        if ($test->teacher_id != $request->user()->id) {
            return response()->json(['errors' => ['Вы не можете удалить этот тест, так как вы не является его автором'], 403]);
        }
        $test->delete();
        return response()->json(['message' => 'Тест успешно удален'], 200);
    }

    public function getTeacherTest(Request $request, $id)
    {
        $test = Test::with(['tasks', 'groups'])
            ->where('teacher_id', $request->user()->id) // Главная проверка
            ->find($id);

        if (!$test) {
            return response()->json([
                'message' => 'Тест не найден'
            ], 404);
        }
        return response()->json([
            'id' => $test->id,
            'name' => $test->name,
            'description' => $test->description,
            'tasks' => $test->tasks,
            'selected_groups' => $test->groups->pluck('id')
        ], 200);
    }
    public function getTestStatistics(Request $request, $id)
    {
        $teacher = $request->user();

        $test = Test::where('id', $id)
            ->where('teacher_id', $teacher->id)
            ->first();

        if (!$test) {
            return response()->json(['message' => 'Тест не найден'], 403);
        }

        $statistics = Result::where('test_id', $id)
            ->with(['student:id,name,group_id', 'student.group:id,name'])
            ->orderBy('result', 'desc')
            ->get();
        error_log(12);
        return response()->json([
            'name' => $test->name,
            'average_score' => $statistics->avg('result'), // Средний балл по тесту
            'total_passes' => $statistics->count(),        // Всего прохождений
            'results' => $statistics->map(function ($res) {
                return [
                    'id' => $res->id,
                    'student_name' => $res->student->name,
                    'group_name' => $res->student->group->name ?? 'Без группы',
                    'score' => $res->result,
                    'date' => $res->created_at->format('d.m.Y H:i'),
                ];
            })
        ], 200);
    }

    public function getAvailableTest(Request $request, $id)
    {
        $student = $request->user();

        // Ищем тест с учетом всех ограничений
        $test = Test::where('id', $id)
            // 1. Проверяем, что тест доступен группе студента
            ->whereHas('groups', function ($query) use ($student) {
                $query->where('groups.id', $student->group_id);
            })
            // 2. Проверяем, что студент его еще не проходил
            ->whereDoesntHave('results', function ($query) use ($student) {
                $query->where('student_id', $student->id);
            })
            ->first();

        if (!$test) {
            return response()->json([
                'message' => 'Тест не найден, уже пройден или не доступен вашей группе'
            ], 404);
        }

        $tasks = $test->tasks()->select([
            'id',
            'test_id',
            'question_title',
            'option_a',
            'option_b',
            'option_c',
            'option_d'
        ])->get();

        return response()->json([
            'id' => $test->id,
            'name' => $test->name,
            'description' => $test->description,
            'tasks' => $tasks
        ], 200);
    }

    public function getTeacherTests(Request $request)
    {
        $tests = $request->user()->tests()
            ->select('id', 'name', 'description', 'teacher_id') // Важно выбрать внешний ключ для работы связи
            ->withCount('tasks')
            ->get();

        return response()->json($tests, 200);
    }

    public function getStudentTests(Request $request)
    {
        $student = $request->user();
        $status = $request->query('status');

        if (!$student->group_id) {
            return response()->json(['errors' => ['Доступ запрещен или группа не назначена']], 403);
        }

        $query = Test::whereHas('groups', function ($q) use ($student) {
            $q->where('groups.id', $student->group_id);
        });

        if ($status === 'available') {
            $query->whereDoesntHave('results', function ($q) use ($student) {
                $q->where('student_id', $student->id);
            });
        } elseif ($status === 'passed') {
            $query->whereHas('results', function ($q) use ($student) {
                $q->where('student_id', $student->id);
            })->with(['results' => function ($q) use ($student) {
                $q->where('student_id', $student->id);
            }]);
        }

        $tests = $query->withCount('tasks')->get();

        $result = $tests->map(function ($test) use ($status) {
            $data = [
                'id' => $test->id,
                'name' => $test->name,
                'description' => $test->description,
                'tasks_count' => $test->tasks_count,
            ];
            if ($status === 'passed') {
                // Берем первый (и единственный) результат студента для этого теста
                $studentResult = $test->results->first();
                $data['result'] = $studentResult ? $studentResult->result : null;
                $data['passed_at'] = $studentResult ? $studentResult->created_at->format('d.m.Y H:i') : null;
            }
            return $data;
        });
        return response()->json($result, 200);
    }

    public function verifyTest(Request $request, $id)
    {
        $student = $request->user();
        $already_passed = Result::where('student_id', $student->id)
            ->where('test_id', $id)
            ->exists();
        if ($already_passed) {
            return response()->json([
                'errors' => ['Вы уже проходили этот тест. Повторное прохождение запрещено.']
            ], 403);
        }
        $validator = Validator::make([...$request->all(), $id], [
            'answers' => 'nullable|array',
            'answers.*.task_id' => 'required|numeric|exists:tasks,id',
            'answers.*.option' => 'required|in:A,B,C,D',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()->all()
            ], 422);
        }
        try {
            $correct_option = Task::where('test_id', $id)->pluck('correct_option', 'id');
            $total_task = $correct_option->count();

            if ($total_task === 0) {
                return response()->json(['error' => 'В данном тесте отсутствуют вопросы'], 400);
            }

            $count_correct_option = 0;

            foreach ($request->answers as $answerData) {
                if ($answerData["option"] == $correct_option[$answerData["task_id"]]) {
                    $count_correct_option++;
                }
            }
            $result = round($count_correct_option / $total_task * 100, 2);
            Result::Create([
                'student_id' => $student->id,
                'test_id' => $id,
                'result' => $result
            ]);

            return response()->json(['result' => $result], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'errors' => ['Ошибка сервера: ' . $e->getMessage()]
            ], 500);
        }
    }
}
