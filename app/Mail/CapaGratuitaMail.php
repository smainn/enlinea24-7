<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CapaGratuitaMail extends Mailable
{
    use Queueable, SerializesModels;
    public $subject = 'Contacto Capa Gratuita enLinea24-7';
    public $solicitud;

    public function __construct($solicitud)
    {
        $this->solicitud = $solicitud;
    }

    public function build()
    {
        return $this->view('capaGratuita.mailCapaGratuita');
    }
}
