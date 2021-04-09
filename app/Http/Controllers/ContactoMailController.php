<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactoMail;
use Illuminate\Support\Facades\Mail;

class ContactoMailController extends Controller
{
    public function index()
    {

    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        // return response()->json(['response'=>$request->all()]);
        try {
            $msg = request()->validate([
                'name' => 'required',
                'email' => 'required|email',
                'city' => 'required',
                'phone' => 'required',
                'subject' => 'required',
                'message' => 'required|min:5'
            ]);
            Mail::to('info@smainn.com')->send(new ContactoMail($msg));
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
