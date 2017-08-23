$(document).ready(function () {
    if (screen.width > 480) { // mobile performance - no full image background if device not capable of showing media query width 480px
        jQuery.backstretch('../Imagenes/IMG_4216.jpg');
    }
    $('#btnEntrar').click(function () {
        var usuario = $('#txtusername').val();
        var pass = $('#txtPass').val();
        if (usuario.length === 0) {
            return false;
        }
        if (pass.length === 0) {
            return false;
        }
        $('#Load').modal('show');
        Enviar(usuario, pass);
    });
    $('#txtPass').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#btnEntrar').click();
        }
    });
    function Enviar(Usuario, Pass) {
        $.ajax({
            type: "POST",
            url: "../Api/Alumno/LoginAlumno",
            data: "{Usuario:'" + Usuario + "',Pass:'" + Pass + "'}",
            contentType: "application/json; charset=utf-8",
            //dataType: "json",
            success: function (data) {
                if (data == null)
                {
                    alertify.alert("Credenciales Incorrectas");
                    $('#Load').modal('hide');
                    return false;
                }
                //alert(data.Nombre);
                sessionStorage.setItem("Nombre", data.Nombre + " " + data.Paterno + " " + data.Materno);
                sessionStorage.setItem("NoControl", data.AlumnoId);
                $('#Load').modal('hide');
                window.open("Alumno/Menu.html", "_parent");
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
});
