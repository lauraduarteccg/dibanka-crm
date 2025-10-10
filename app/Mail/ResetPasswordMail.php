<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function build()
    {
        $url = env('APP_URL') . "/recuperar-contraseña?token={$this->token}&email=" . urlencode($this->email);

        return $this->subject('Restablece tu contraseña')
            ->view('emails.reset-password')
            ->with([
                'url' => $url,
            ]);
    }
}
