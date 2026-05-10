<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Таблица tests
        Schema::create('tests', function (Blueprint $table) {
            $table->id('id');
            $table->string('name', 30);
            $table->string('description', 500);
            $table->foreignId('teacher_id')
                ->constrained('teachers', 'id')
                ->onDelete('cascade');
            $table->timestamps();

            $table->index('teacher_id');
        });

        // 2. Таблица tasks (теперь просто ссылается на тест)
        Schema::create('tasks', function (Blueprint $table) {
            $table->id('id');
            $table->foreignId('test_id')
                ->constrained('tests', 'id') // Ссылка на id в таблице tests
                ->onDelete('cascade');
            $table->string('question_title', 1000);
            $table->string('option_a', 1000);
            $table->string('option_b', 1000)->nullable();
            $table->string('option_c', 1000)->nullable();
            $table->string('option_d', 1000)->nullable();
            $table->enum('correct_option', ['A', 'B', 'C', 'D']);
            $table->timestamps();

            $table->index('test_id');
        });

        // 3. Таблица group_test (Связь Группы и Теста)
        Schema::create('group_test', function (Blueprint $table) {
            $table->id('id');
            $table->foreignId('group_id')
                ->constrained('groups', 'id')
                ->onDelete('cascade');
            $table->foreignId('test_id')
                ->constrained('tests', 'id')
                ->onDelete('cascade');
            $table->timestamps();

            $table->index('group_id');
            $table->index('test_id');
            $table->unique(['group_id', 'test_id']); // Чтобы одну группу нельзя было привязать к тесту дважды
        });

        // 4. Таблица results
        Schema::create('results', function (Blueprint $table) {
            $table->id('id');
            $table->foreignId('student_id')
                ->constrained('students', 'id')
                ->onDelete('cascade');
            $table->foreignId('test_id')
                ->constrained('tests', 'id')
                ->onDelete('cascade');
            $table->integer('result');
            $table->timestamps();

            $table->index('student_id');
            $table->index('test_id');

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('results');
        Schema::dropIfExists('group_test');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('tests');
    }
};
