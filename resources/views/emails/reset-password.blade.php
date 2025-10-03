<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Restablecer contraseña</title>
</head>
<body style="font-family: Montserrat, sans-serif; background: #EEEEEE; padding: 20px;">
    <table align="center" width="600" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 2px 2px 10px 1.1px rgb(138, 138, 138);">
        <tr>
            <td align="center">
                <h2 style="color: #19577e;">¿Olvidaste tu contraseña?</h2>
                <p style="color: #555;">
                    Haz clic en el botón de abajo para restablecerla.
                </p>
                <a href="{{ $url }}" 
                   style="display: inline-block; padding: 12px 24px; margin: 20px 0; 
                          background: #2eb8e8; color: white; text-decoration: none; 
                          border-radius: 5px; font-weight: bold;">
                    Restablecer contraseña
                </a>
                <p style="color: #999; font-size: 12px;">
                    Si no solicitaste este cambio, puedes ignorar este mensaje.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
