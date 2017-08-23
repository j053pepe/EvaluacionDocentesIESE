$(function init() {
    var ServiciosDetalles, Resultados, winpops;
    $('#divNombre').hide();
    //GenerarGrafica();
    Servicios();
    function GenerarGrafica() {
        Highcharts.chart('Graficas', {
            data: {
                table: 'datatable'
            },
            chart: {
                type: 'column'
            },
            title: {
                text: 'Grafica total de registros'
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: 'Alumnos'
                }
            }
        });
    }

    function Servicios() {
        $('#Load').modal('show');
        $("#slcServicio").empty();
        $("#slcServicio").selectpicker('refresh');
        $('.selectpicker').selectpicker({
            style: 'btn-info',
            size: 10
        });

        $.ajax({
            type: "Get",
            url: "../../Api/Servicios/TraerTodosServicios",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var Servicios = data;
                $(Servicios).each(function () {
                    var option = $(document.createElement('option'));

                    option.text(this.Descripcion);
                    option.val(this.ServicioId);

                    $("#slcServicio").append(option);
                });
                $("#slcServicio").selectpicker('refresh');
                $('#slcServicio').selectpicker('setStyle', 'btn-primary');
                $('#Load').modal('hide');
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }

    (function () {

        var beforePrint = function () {
            $('#divFondo').show();
            $('#divNombre').hide();
            $('#divFiltros').show();
            $('#Menu').show();
            $('#divGeneral').css('background-color', '');
        };

        var afterPrint = function () {
            console.log('Functionality to run after printing');
        };

        if (window.matchMedia) {
            var mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(function (mql) {
                if (mql.matches) {
                    beforePrint();
                } else {
                    afterPrint();
                }
            });
        }

        window.onbeforeprint = beforePrint;
        window.onafterprint = afterPrint;

    }());

    $('#btnImprimir').on('click', function () {
        
        CrearPopup();
        
    });

    function CrearPopup() {

        $('#divGeneral').css('background-color', 'white');
        $('#divNombre').show();
        $('#divFiltros').hide();
        $('#divFondo').hide();
        $('#Menu').hide();
        window.print(); 
    }

    $("#slcPeriodo").change(function () {
        $("#slcCarrera").empty();
        $("#slcCarrera").selectpicker('refresh');

        $(ServiciosDetalles.Sistema).each(function () {
            if (this.SistemaId.toString() === $('#slcModalidad').val()) {
                $(this.Periodos).each(function () {
                    if (this.PeriodoId.toString() === $('#slcPeriodo').val()) {
                        $(this.Carreras).each(function () {
                            var option = $(document.createElement('option'));

                            option.text(this.Descripcion);
                            option.val(this.CarreraId);

                            $("#slcCarrera").append(option);
                        });
                    }
                });
            }
        });
        $("#slcCarrera").selectpicker('refresh');
        $('#slcCarrera').selectpicker('setStyle', 'btn-primary');
    });

    $('#slcServicio').change(function () {
        if ($('#slcServicio').val() === -1) { return false; }
        $('#lblNombre').text("Servicio: " + $("#slcDocente option:selected").text());
        $('#Load').modal('show');
        $.ajax({
            type: "Get",
            url: "../../Api/Servicios/ObtenerPeriodos",
            data: {ServicioId: $('#slcServicio').val() },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data !== null) {
                    ServiciosDetalles = data;
                    CargarSabatino(data.Sistema);
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    });

    function CargarSabatino(Sabatino) {
        $(Sabatino).each(function () {
            var option = $(document.createElement('option'));

            option.text(this.Descripcion);
            option.val(this.SistemaId);

            $("#slcModalidad").append(option);
        });
        $("#slcModalidad").selectpicker('refresh');
        $('#slcModalidad').val(-1);
        $("#slcModalidad").selectpicker('refresh');
        $('#slcModalidad').selectpicker('setStyle', 'btn-primary');
        $("#slcModalidad").change();
    }

    $("#slcModalidad").change(function () {
        //
        $("#slcPeriodo").empty();
        $("#slcPeriodo").selectpicker('refresh');
        ///
        $("#slcCarrera").empty();
        $("#slcCarrera").selectpicker('refresh');
        
        $(ServiciosDetalles.Sistema).each(function () {
            if (this.SistemaId.toString() === $('#slcModalidad').val()) {
                $(this.Periodos).each(function () {
                    var option = $(document.createElement('option'));

                    option.text(this.Descripcion);
                    option.val(this.PeriodoId);

                    $("#slcPeriodo").append(option);
                });
            }
        });
        $("#slcPeriodo").selectpicker('refresh');
        $('#slcPeriodo').selectpicker('setStyle', 'btn-primary');
        $('#Load').modal('hide');
    });

    $('#btnBuscar').on('click', function () {
        var Servicio = $('#slcServicio').val();
        var Modalidad = $('#slcModalidad').val();
        var Periodo = $('#slcPeriodo').val();
        var Carrera = $('#slcCarrera').val();
        var datos = {
            Servicio: Servicio,
            Sabatino: Modalidad,
            Periodo: (Periodo === "" ? -1 : Periodo),
            Carrera: (Carrera === "" ? -1 : Carrera)
        };
        if (Servicio > 0) {
            $('#Load').modal('show');
            $(function () {
                $.ajax({
                    type: "GET",
                    url: "../../Api/Reportes/GenerarReportesServicios",
                    data: datos,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data !== null) {
                            $('#Load').modal('hide');
                            Resultados = data;
                            CrearReportes();
                        } else {
                            alertify.alert("Error al generar el reporte");
                            $('#Load').modal('hide');
                        }
                    },
                    error: function (f) {
                        $('#Load').modal('hide');
                        alertify.alert("Error, intente mas tarde");
                    }
                });
            });
            $(function () {
                $.ajax({
                    type: "Get",
                    url: "../../Api/Reportes/GenerarComentariosServicios",
                    data: datos,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data.length > 0) {
                            Comentarios(data);
                        }
                    },
                    error: function (f) {
                        $('#Load').modal('hide');
                        alertify.alert("Error, intente mas tarde");
                    }
                });
            });
        } else {
            alertify.alert("no selecciono un Servicio");
        }
    });

    function Comentarios(lstComentarios) {
        $('#dvComentarios').empty();
        $('#dvComentarios').append();
        $(lstComentarios).each(function () {
            var Coment;
            Coment = "<div class='col-md-12 form-group' id='divCom" + this.ComentarioId + "'>" +
                        "<spam class='form-control' readonly rows='2' >" +
                        this.Comentario
                    + "</spam>"
                    + "</div>";
            $('#dvComentarios').append(Coment);
        });
    }

    function CrearReportes() {
        $('#dvPreguntas').empty();
        $(Resultados).each(function () {
            var div = '<div id="Graficas' + this.PreguntaId + '" style="height:300px" class="col-md-11">';

            var myhig = new Array();
            $(this.Opciones).each(function () {
                myhig.push([this.Descripcion, this.TotalA]);
            });
            div += '</div><div><hr /></div>';

            CrearTablaD('tabla' + this.PreguntaId, myhig);
            $('#dvPreguntas').append(div);

            Creargrafica('Graficas' + this.PreguntaId, 'tabla' + this.PreguntaId, this.PreguntaDescripcion);

        });
    }
    function CrearTablaD(tablaId, datos) {
        var tr = '<tr><td>Respuestas</td>';
        var table = '<table style="width:100%; display:none;"  id="' + tablaId + '" >' +
            '<tbody>' +
              '<tr><th>Opciones</th>';
        $(datos).each(function () {
            table += '<th>' + this[0] + '</th>';
            tr += '<td>' + this[1] + '</td>';
        });
        tr += '</tr>';
        //'<th>Firstname</th>'
        table += '</tr></tbody>' + tr + '</table></tr>';
        $('#dvPreguntas').append(table);
    }
    function Creargrafica(graficaid, id, titulo) {
        Highcharts.chart(graficaid, {
            data: {
                table: id
            },
            chart: {
                type: 'column'
            },
            title: {
                text: titulo
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: 'Alumnos'
                }
            }
        });
    }
});