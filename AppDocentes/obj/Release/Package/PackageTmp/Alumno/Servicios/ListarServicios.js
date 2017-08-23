$(function Init() {
    var tblServicios;
    TraerServicios();

    function CargarTablaServicios(data) {
        tblServicios = $('#tblServicos').dataTable({
            "aaData": data,
            "aoColumns": [
                { "mDataProp": "ServicioId" },
                { "mDataProp": "Descripcion" },
                {
                    "mDataProp": "ServicioId",
                    "mRender": function (data) {
                        return "<a href='' class='btn blue' onclick='return false;'>" + "Calificar Servicio" + " </a> ";
                    }
                },
            ],
            "lengthMenu": [[20, 50, 100, -1], [20, 50, 100, 'Todos']],
            "searching": true,
            "ordering": false,
            "info": false,
            "async": true,
            "bDestroy": true,
            "language": {
                "lengthMenu": "_MENU_  Registros",
                "paginate": {
                    "previous": "Anterior",
                    "next": "Siguiente"
                },
                "search": "Buscar.. ",
            },
            "order": [[1, "desc"]]
        });
        $('#Load').modal('hide');
    }
    function TraerServicios() {
        $('#Load').modal('show');
        var Alumno = sessionStorage.getItem("NoControl");
        $.ajax({
            type: "GET",
            url: "../../Api/Servicios/TraerServicios",
            data: { AlumnoId: Alumno },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    CargarTablaServicios(data);
                } else {
                    $('#Load').modal('hide');
                    return false;
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });

    }

    $('#tblServicos').on('click', 'a', function () {
        var row = this.parentNode.parentNode;
        var rowadd = tblServicios.fnGetData($(this).closest('tr'));

        sessionStorage.setItem('Descripcion', rowadd.Descripcion);
        sessionStorage.setItem('ServicioId', rowadd.ServicioId);
        sessionStorage.setItem('Periodo', rowadd.PeriodoS)
        sessionStorage.setItem('PeriodoId', rowadd.PeriodoId)
        sessionStorage.setItem('Carrera', rowadd.Carrera);
        sessionStorage.setItem('CarreraId', rowadd.CarreraId);
        sessionStorage.setItem('Sabatino', rowadd.Sabatino);


        window.open("../Servicios/CargarServicios.html", "_parent");
    });
});