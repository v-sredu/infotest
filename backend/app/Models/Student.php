<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;


class Student extends Authenticatable
{

    use HasApiTokens;

    protected $table = 'students';
    protected $primaryKey = 'id';
    public $incrementing = true;

    protected $fillable  = [
        'name',
        'surname',
        'email',
        'group_id',
        'password',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }
}
