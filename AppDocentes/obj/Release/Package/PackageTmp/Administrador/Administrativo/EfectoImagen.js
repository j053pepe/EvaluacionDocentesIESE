$(document).ready(function () {
    if (screen.width > 480) { // mobile performance - no full image background if device not capable of showing media query width 480px
        jQuery.backstretch('../../Imagenes/IMG_4216.jpg');
    }
    Sesion();
    function Sesion() {
        var UserName = sessionStorage.getItem("UserName");
        var Nombre = sessionStorage.getItem("Nombre");
        if (UserName == null) {
            window.open("../Administrativo/Index.html", "_parent");
        }
    }
});