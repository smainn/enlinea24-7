<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\CapaGratuitaMail;
use Illuminate\Support\Facades\Mail;

class CapaGratuitaController extends Controller
{
    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        try {
            $solicitud = request()->validate([
                'name' => 'required',
                'lastName' => 'required',
                'company' => 'required',
                'phone' => 'required|numeric',
                'email' => 'required|email',
                'city' => 'required',
                'country' => 'required'
            ]);
            Mail::to('info@smainn.com')->send(new CapaGratuitaMail($solicitud));
            return response()->json(['response'=>'1']);
        } catch (\Throwable $th) {
            return response()->json(['response'=> '-1']);
        }
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
