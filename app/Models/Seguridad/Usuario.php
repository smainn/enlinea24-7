<?php

namespace App\Models\Seguridad;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Auth\Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;

class Usuario extends Model implements AuthenticatableContract, JWTSubject
{
    use SoftDeletes;
    use Authenticatable;
    
    protected $table = 'usuario';
    protected $primaryKey = 'idusuario';
    protected $fillable = [
        'nombre', 'apellido', 'sexo', 'fechanac', 'login', 'email', 
        'telefono', 'foto', 'estado', 'notas', 'password'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return [];
    }

    public function getToken($credentials, $connection) {
        $user = $this->find(1);
        //$this->setConnection($connection);
        //$jwt = new JWTAuth();
        //return $jwt->fromUser($this);
        //return JWTAuth::attempt($credentials);
        return JWTAuth::fromUser($user);
    }
}
