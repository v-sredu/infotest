<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Таблица groups
        Schema::create('groups', function (Blueprint $table) {
            $table->id('id');
            $table->string('name', 20);
        });

        // Таблица students
        Schema::create('students', function (Blueprint $table) {
            $table->id('id');
            $table->string('name', 20);
            $table->string('surname', 20);
            $table->string('email', 30)->unique();
            $table->unsignedBigInteger('group_id')->nullable();
            $table->string('password', 100);
            $table->rememberToken();
            $table->timestamps();

            // Внешний ключ
            $table->foreign('group_id')
                ->references('id')
                ->on('groups')
                ->onDelete('set null')
                ->onUpdate('cascade');

            // Индекс
            $table->index('group_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
        Schema::dropIfExists('groups');
    }
};
