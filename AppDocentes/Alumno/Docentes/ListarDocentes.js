$(document).ready(function () {
    var tblDocentes;
    TraerDocentes();

    function CargarTablaDocentes(data) {
        tblDocentes = $('#tblDocentes').dataTable({
            "aaData": data,
            "aoColumns": [
                 {
                     "mDataProp": "RutaFoto",
                     "mRender": function (NombreCol, Displ, dto) {
                         return '<img class="" src="' + dto.RutaFoto + '" width="100" height="120" /> ';
                     }
                 },
                {"mDataProp": "NombreDocente"},
                { "mDataProp": "MateriaS" },
                { "mDataProp": "PeriodoS" },                
                {
                    "mDataProp": "AlumnoMateriaId",
                    "mRender": function (data) {
                        return "<a href='' class='btn blue' onclick='return false;'>" +"Calificar Docente"+ " </a> ";
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
    function TraerDocentes() {
        $('#Load').modal('show');
        var Alumno = sessionStorage.getItem("NoControl");
        $.ajax({
            type: "Get",
            url: "../../Api/Docente/ObtenerDocentes",
            data: {AlumnoId:Alumno },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    CargarTablaDocentes(data);
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

    $('#tblDocentes').on('click', 'a', function () {
        var row = this.parentNode.parentNode;
        var rowadd = tblDocentes.fnGetData($(this).closest('tr'));

        sessionStorage.setItem('NombreD', rowadd.NombreDocente);
        sessionStorage.setItem('DocenteId', rowadd.DocenteId);
        sessionStorage.setItem('Periodo', rowadd.PeriodoS)
        sessionStorage.setItem('PeriodoId', rowadd.PeriodoId)
        sessionStorage.setItem('Carrera', rowadd.CarreraS);
        sessionStorage.setItem('CarreraId', rowadd.CarreraId);
        sessionStorage.setItem('MateriaId', rowadd.MateriaId);
        sessionStorage.setItem('Modalidad', rowadd.EsSabatino ? 'Semi-Escolarizado' : 'Escolarizado');
        sessionStorage.setItem('Ruta', rowadd.RutaFoto);


        window.open("../Preguntas/ListaPreguntas.html", "_parent");
    });
});