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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id('id'); // PRIMARY KEY AUTO_INCREMENT
            $table->string('name', 20); // VARCHAR(20) NOT NULL
            $table->string('surname', 20); // VARCHAR(20) NOT NULL
            $table->string('email', 30)->unique(); // UNIQUE KEY EMAIL_TEACHER
            $table->string('password', 100); // VARCHAR(100) NOT NULL
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
