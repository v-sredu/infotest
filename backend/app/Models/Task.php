<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;
    protected $fillable = [
        'test_id',
        'question_title',
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_option',
    ];
}
