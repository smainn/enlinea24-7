<?php

namespace App\Http\Controllers\Comercio\Ventas;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Comercio\Ventas\ReferenciaDeContacto;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Crypt; 

class ReferenciaDeContactoController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index(Request $request)
    {
        try {
            $connection = Crypt::decrypt($request->get('x_conexion'));

            $ref = new ReferenciaDeContacto();
            $ref->setConnection($connection);
            $referenciaContacto = $ref->get();
            
            return response()->json([
                "response"=>1,
                "data"=>$referenciaContacto
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'response' => 0,
                'message' => 'Ocurrio un problema al obtener los datos'
            ]);
        }
        
    }

    /**
     * Show the form for creating a new resource.
     * @return Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function store(Request $request)
    {
    }

    /**
     * Show the specified resource.
     * @return Response
     */
    public function show()
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     * @return Response
     */
    public function edit()
    {
        
    }

    /**
     * Update the specified resource in storage.
     * @param  Request $request
     * @return Response
     */
    public function update(Request $request)
    {
    }

    /**
     * Remove the specified resource from storage.
     * @return Response
     */
    public function destroy()
    {
    }
}
