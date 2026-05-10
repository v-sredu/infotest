<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    protected $table = 'results';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;
    protected $fillable = [
        'student_id',
        'test_id',
        'result',
    ];
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
    public function test()
    {
        return $this->belongsTo(Test::class, 'test_id');
    }
}
