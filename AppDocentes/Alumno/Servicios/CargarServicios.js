$(function Init() {
    var objServicio;
    var tabs = [];
    var PregResp = [];
    DatosServicios();
    var form = $('#frmPreguntas');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    form.validate({
        focusInvalid: false, // do not focus the last invalid input
        rules: {

        },
        invalidHandler: function (event, validator) { //display error alert on form submit              
            success.hide();
            error.show();
        },
        submitHandler: function (form) {
            success.show();
            error.hide();
        }
    });

    function DatosServicios() {
        $('#Load').modal('show');
        objServicio = {
            AlumnoId: sessionStorage.getItem("NoControl"),
            ServicioId: sessionStorage.getItem("ServicioId"),
            Descripcion : sessionStorage.getItem("Descripcion"),
            PeriodoS: sessionStorage.getItem("Periodo"),
            PeriodoId: sessionStorage.getItem("PeriodoId"),
            Carrera: sessionStorage.getItem("Carrera"),
            CarreraId: sessionStorage.getItem("CarreraId"),
            Sabatino: sessionStorage.getItem("Sabatino")
        };
        if (objServicio.ServicioId == null
            || objServicio.PeriodoS == null
            || objServicio.Carrera == null) {
            sessionStorage.clear();
            window.open("../Alumno/Index.html", "_parent");
        }
        //sessionStorage.removeItem('NombreD');
        //sessionStorage.removeItem('Periodo')
        //sessionStorage.removeItem('Carrera');
        //sessionStorage.removeItem('Modalidad');
        //sessionStorage.removeItem('Ruta');

        FechaActual();
        $('#txtNombre').val(objServicio.Descripcion);
        $('#txtCarrera').val(objServicio.Carrera);
        $('#txtPeriodo').val(objServicio.PeriodoS);
        TraerPreguntas(objServicio.AlumnoId, objServicio.ServicioId);
    }
    function FechaActual() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }
        var mes = (mm == '01' ? 'Enero' :
                mm == '02' ? 'Febrero' :
                mm == '03' ? 'Marzo' :
                mm == '04' ? 'Abril' :
                mm == '05' ? 'Mayo' :
                mm == '06' ? 'Junio' :
                mm == '07' ? 'Julio' :
                mm == '08' ? 'Agosto' :
                mm == '09' ? 'Septiembre' :
                mm == '10' ? 'Octubre' :
                mm == '11' ? 'Noviembre' : 'Diciembre');

        today = dd + ' de ' + mes + ' del ' + yyyy;
        $('#txtFecha').val(today);
    }
    function CargarPreguntas(lista) {
        var htmlPregunta = '';
        var counttb = 0;
        var Residuo = 0;
        var nameoption = [];
        $(lista).each(function (indice, objeto) {
            Residuo = indice % 5;
            if ((Residuo == 0) || (indice == 0)) {
                counttb += 1;
                tabs.push('tab' + counttb);
                if (indice > 0) {
                    if (counttb > 2) {
                        htmlPregunta +=
                       ' <div class="col-xs-12 col-md-9"></div><div class="col-xs-6 col-md-3">';
                        htmlPregunta += '<a class="btn bg-warning text-white">Anterior</a><a class="btn bg-success text-white">Siguiente</a>';
                    } else {
                        htmlPregunta +=
                        ' <div class="col-xs-12 col-md-10"></div><div class="col-xs-6 col-md-2">';
                        htmlPregunta += '<a class="btn bg-success text-white">Siguiente</a>';
                    }
                    htmlPregunta += '</div></div><div id="tab' + counttb + '" class="tab-pane">';
                } else {
                    htmlPregunta += '<div id="tab' + counttb + '" class="tab-pane ">';
                }
            }
            htmlPregunta += '<div class="col-md-12 form-control" name="Pregunta">'
                                       + '<div class="col-md-5">'
                                       + '    <label class="text-primary" >' + objeto.Descripcion + '</label>'
                                       + '</div>'
           + '<div class="col-md-7 form-group">';
            $(objeto.Opciones).each(function (indicie2, objeto2) {
                nameoption.push('option' + objeto.PreguntaId + indicie2);
                htmlPregunta += '  <label class="btn ">'
                                                 + '<input type="radio" name="option' + objeto.PreguntaId + '"' +
                                                 'data-preguntaid=' + objeto.PreguntaId +
                                                 ' data-config=' + objeto.ConfiguracionEncuestaId +
                                                 ' data-Opcion="' + objeto2.OpcionPreguntaId +
                                                 '" id="option' + objeto.PreguntaId + indicie2 +
                                                 '" >' + objeto2.Descripcion
                                             + '</label>';
            });
            htmlPregunta += '</div>' + '</div>';

        });
        htmlPregunta += ' <div class="col-xs-12 col-md-10"></div><div class="col-xs-6 col-md-2">' +
        tabs.length > 1 ? '<a class="btn bg-warning text-white">Anterior</a></div>' : '' +
            '<div class="form-group col-md-12">' +
            '<label for="comment">Observaciones: (opcional)</label>' +
            '<textarea id="txtObservaciones" class="form-control" rows="3" maxlength="200"></textarea>' +
        '</div>' + '<div class="col-md-10"></div>' + '<div class="col-md-2">' + '<button class="btn btn-success" id="btnGuardar" >Guardar</button>' + '</div>' +
        '</div>';
        $('#frmPreguntas').append(htmlPregunta);
        //Ocultamos Tabs 
        $(tabs).each(function (a, d) {
            if (a == 0) { $('#' + d).show(); } else { $('#' + d).hide(); }
        });
        CrearValidador(nameoption);
    }
    function CrearValidador(lstOpciones) {

        $(lstOpciones).each(function (indice, id) {
            form.validate();
            $('#' + id).rules("add", {
                required: true,
                messages: {
                    required: ''
                }
            });
        });
        $('#Load').modal('hide');
    }
    function GuardarTest() {
        var comentario = $('#txtObservaciones').val();
        comentario = comentario.length == 0 ? "" : comentario;
        var JsonObj = {
            TestAlumno: {
                AlumnoId: objServicio.AlumnoId,
                Periodo: objServicio.PeriodoId,
                Carrera: objServicio.CarreraId,
                ServicioId: objServicio.ServicioId,
                Comentario: comentario,
                Sabatino: objServicio.Sabatino,
                Preguntas: []
            }
        };
        JsonObj.TestAlumno.Preguntas = PregResp;
        var js = JSON.stringify(JsonObj);
        $.ajax({
            type: "PUT",
            url: "../../Api/Alumno/GuardarTestServicios",
            data: js,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data == true) {
                    $('#Load').modal('hide');
                    alertify.alert("Encuesta Guardada", function () {
                        window.open('../Servicios/ListarServicios.html', '_parent');
                    });
                } else {
                    alertify.alert("Error al guardar, intente de mas tarde.");
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function siguiente(id) {
        $('#' + id).hide();
        var ultimo = id.replace('tab', '');
        var entero = parseInt(ultimo);
        entero += 1;
        $('#tab' + String(entero)).show();
    }
    function anterior(id) {
        $('#' + id).hide();
        var ultimo = id.replace('tab', '');
        var entero = parseInt(ultimo);
        entero -= 1;
        $('#tab' + String(entero)).show();
    }
    function TraerPreguntas(NoControl, ServicioId) {
        $.ajax({
            type: "Get",
            url: "../../Api/Preguntas/ObtenerPreguntasServicios",
            data: { NoControl: NoControl, ServicioId: ServicioId  },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    CargarPreguntas(data);
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
    $('#Preguntas').on('click', 'button', function () {
        if (form.valid()) {
            $('#Load').modal('show');
            error.hide();
            success.show();
            GuardarTest();
        } else {
            alertify.alert("Es necesrio que todas las preguntas sean constestadas.");
        }

    });
    $('#Preguntas').on('click', 'a', function () {
        var div = $(this);
        div = div[0].parentElement.parentElement;
        if (this.text == 'Anterior') { anterior(div.id); }
        if (form.valid()) {
            error.hide();
            success.show();
            if (this.text == 'Siguiente') { siguiente(div.id); }
        }
    });
    $('#Preguntas').on('click', 'input', function () {
        var obj = {
            'PreguntaId': $(this).data('preguntaid'),
            'Respuesta': $(this).data('opcion'),
            'ConfiguracionEncuestaId': $(this).data('config')
        };
        //index of Pendiente 
        var indice = -1;
        $(PregResp).each(function (index, d) {
            if (d.PreguntaId === obj.PreguntaId) {
                d.Respuesta = obj.Respuesta;
                indice = index;
            }
        });
        if (indice == -1) {
            PregResp.push(obj);
        }
        //console.log(PregResp);
    });
});