$(document).ready(function () {
    TraerCarreras();
    function TraerCarreras() {
        $("#slcCarrera").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('-1');
        $("#slcCarrera").append(optionP);

        $.ajax({
            type: "POST",
            url: "../WS/Carrera.asmx/TraerCarreras",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    var Carreras = data.d;
                    $(Carreras).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.CarreraId);

                        $("#slcCarrera").append(option);
                    });
                }
            }
        });
    }
});