<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Test extends Model
{
    protected $table = 'tests';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;
    protected $fillable = [
        'name',
        'description',
        'teacher_id',
    ];
    // Связь с вопросами
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // Связь с группами через pivot таблицу group_test
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_test', 'test_id', 'group_id');
    }
    public function results()
    {
        return $this->hasMany(Result::class, 'test_id', 'id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
