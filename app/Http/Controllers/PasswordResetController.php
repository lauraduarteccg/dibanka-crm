<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Response;

class PasswordResetController extends Controller
{

    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            // 📝 Registrar envío exitoso
            log_activity('enviar_enlace_restablecimiento', 'Usuarios', [
                'mensaje' => "El usuario solicitó un enlace de restablecimiento de contraseña.",
                'correo_destinatario' => $request->email,
                'resultado' => 'Éxito'
            ], $request);

            return response()->json([
                'mensaje' => 'Se ha enviado el enlace de restablecimiento al correo proporcionado.'
            ], Response::HTTP_OK);
        }

        // 📝 Registrar intento fallido
        log_activity('error_enviar_enlace_restablecimiento', 'Usuarios', [
            'mensaje' => "Fallo al intentar enviar el enlace de restablecimiento.",
            'correo_destinatario' => $request->email,
            'resultado' => 'Fallido'
        ], $request);

        return response()->json([
            'mensaje' => 'No se pudo enviar el enlace de restablecimiento. Verifica el correo electrónico.'
        ], Response::HTTP_BAD_REQUEST);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            log_activity('restablecer_contraseña', 'Usuarios', [
                'mensaje' => "Se ha restablecido correctamente la contraseña de un usuario.",
                'correo' => $request->email,
                'resultado' => 'Éxito'
            ], $request);

            return response()->json([
                'mensaje' => 'La contraseña se ha restablecido correctamente.'
            ], Response::HTTP_OK);
        }

        log_activity('error_restablecer_contraseña', 'Usuarios', [
            'mensaje' => "Intento fallido de restablecimiento de contraseña.",
            'correo' => $request->email,
            'resultado' => 'Fallido'
        ], $request);
        return response()->json([
            'mensaje' => 'No se pudo restablecer la contraseña. El token puede ser inválido o haber expirado.'
        ], Response::HTTP_BAD_REQUEST);
    }
}
