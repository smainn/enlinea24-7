<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ContactoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject = 'Contacto enLinea24-7';
    public $msg;

    public function __construct($msg)
    {
        $this->msg = $msg;
    }

    public function build()
    {
        return $this->view('contacto.mail');
    }
}
