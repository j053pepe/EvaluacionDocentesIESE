$(document).ready(function () {
    Sesion();
    if (screen.width > 480) { // mobile performance - no full image background if device not capable of showing media query width 480px
        jQuery.backstretch('../../Imagenes/IMG_4216.jpg');
    }
    function Sesion() {
        var UserName = sessionStorage.getItem("NoControl");
        var Nombre = sessionStorage.getItem("Nombre");
        if (UserName == null) {
            window.open("../../Index.html", "_parent");
        } else {
            $('#MenuAlumno').load('../Alumno/MDinamic.html');
            $('#lblNombre').text(Nombre);
        }
    }
});