<!DOCTYPE html>
<html lang="es">
<head>
    <title>Mensaje Recibido</title>
</head>
<body>

    <div style="width: 100%;">
        <p style="padding-left: 20px; padding-right: 30px;
            font-size: 16px;">
        Estimado usuario, <strong>EnLinea24-7</strong> tiene el agrado de comunicarle 
            que fue recuperado su password, las credenciales de su cuenta son:
        </p>
    </div>

    <div style="width: 100%; margin-top: 20px; padding-left: 20px; padding-right: 20px;">

        <p style="font-weight: bold;">
            DATOS PERSONALES
        </p>
    
        <p style="font-weight: bold; font-size: 14px;">Nombre: 
            <label style="font-weight: normal"><?= $user->nombre.' '.$user->apellido?></label>
        </p>
    
        <p style="font-weight: bold; font-size: 14px;">Telefono: 
            <label style="font-weight: normal"><?= $user->telefono?></label>
        </p>
   
        <p style="font-weight: bold; font-size: 14px;">Email: 
            <label style="font-weight: normal"><?= $user->email?></label>
        </p>

        <p style="margin-top: 15px; font-size: 16px;">
            Datos para acceso a la plataforma de <strong>EnLinea24-7</strong>  son:
        </p>
    
        <p style="font-weight: bold; font-size: 14px;">Username: 
            <label style="font-weight: normal"><?= $user->login?></label>
        </p>
    
        <p style="font-weight: bold; font-size: 14px;">Nuevo Password: 
            <label style="font-weight: normal"><?= $password ?></label>
        </p>

    </div>

</body>
</html>