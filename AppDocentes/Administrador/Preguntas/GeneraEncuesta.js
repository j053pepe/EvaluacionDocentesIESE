$(function init() {
    var tblDocentes;
    var tblConfiguracion;
    var form = $('#frmConfEncuesta');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            ddPeriodo: {
                required: true
            },
            ddTipoCarrera: {
                required: true
            }
        },
        messages: {
            ddPeriodo: "Seleccione periodo",
            ddTipoCarrera: "Seleccione area"
        },

        invalidHandler: function (event, validator) { //display error alert on form submit              
            success.hide();
            error.show();
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group   
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.form-group').removeClass('has-error');
        },

        success: function (label, element) {
            label
                .closest('.form-group').removeClass('has-error');
        },

        submitHandler: function (form) {
            success.show();
            error.hide();
        }
    });
    //end validate 
    var form2 = $('#frmEncuesta');
    form2.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            ddCategoria: {
                required: true
            },
            ddPregunta: {
                required: true
            },
        },
        messages: {
            ddCategoria: "Seleccione categoria",
            ddPregunta: "Seleccione pregunta"
        },

        invalidHandler: function (event, validator) { //display error alert on form submit              
            success.hide();
            error.show();
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group   
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.form-group').removeClass('has-error');
        },

        success: function (label, element) {
            label
                .closest('.form-group').removeClass('has-error');
        },

        submitHandler: function (form) {
            success.show();
            error.hide();
        }
    });

    var form3 = $('#frmConfiguraEnc');
    form3.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            FechaInicio: {
                required: true
            },
            FechaFin: {
                required: true
            },
            ddEstatus: {
                required: true
            },
        },
        messages: {
            FechaInicio: "Ingrese fecha inicio",
            FechaFin: "Ingrese fecha fin",
            ddEstatus: "Seleccione estatus"
        },

        invalidHandler: function (event, validator) { //display error alert on form submit              
            success.hide();
            error.show();
        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.form-group').addClass('has-error'); // set error class to the control group   
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.form-group').removeClass('has-error');
        },

        success: function (label, element) {
            label
                .closest('.form-group').removeClass('has-error');
        },

        submitHandler: function (form) {
            success.show();
            error.hide();
        }
    });

    //Cargamos los periodos
    CargarPeriodos();
    function CargarPeriodos() {
        //$('#divDocMateria').hide();
        //$('#Load').modal('show');
        //$("#slcPeriodo").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('');
        $("#ddPeriodo").append(optionP);

        $.ajax({
            type: "GET",
            url: "../../Api/Periodo/TraerPeriodos",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Periodos = data;
                    $(Periodos).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.PeriodoId);

                        $("#ddPeriodo").append(option);
                    });
                    //para recuperar los demas datos. 
                }
            }
        });
    }
    //end periodos




    //Cargamos TipoDeCarrera
    function CargarTipoCarrera() {
        //$('#divDocMateria').hide();
        //$('#Load').modal('show');
        $("#ddTipoCarrera").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('');
        $("#ddTipoCarrera").append(optionP);

        $.ajax({
            type: "GET",
            url: "../../Api/Preguntas/CargaTipoCarrera",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Periodos = data;
                    $(Periodos).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.TipoCarreraId);

                        $("#ddTipoCarrera").append(option);
                    });
                    //para recuperar los demas datos. 
                }
            }
        });
    }
    //end TipoCarrera




    //Cargamos las categorias  
    //CargarCategorias();
    function CargarCategorias() {
        //$('#divDocMateria').hide();
        //$('#Load').modal('show');
        $("#ddCategoria").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('');
        $("#ddCategoria").append(optionP);

        $.ajax({
            type: "GET",
            url: "../../Api/Preguntas/CargaCategorias",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Periodos = data;
                    $(Periodos).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.CategoriaId);

                        $("#ddCategoria").append(option);
                    });
                    //para recuperar los demas datos. 
                }
            }
        });
    }
    //end Categorias

    //Cargamos las Preguntas
    //CargarPreguntas();
    function CargarPreguntas(ConfiguracionEncuestaId) {
        //$('#divDocMateria').hide();
        //$('#Load').modal('show');
        //$("#slcPeriodo").empty();

        var datos = {
            ConfiguracionEncuestaId: ConfiguracionEncuestaId,
            CategoriaId: $('#ddCategoria').val()
        };


        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('');
        $("#ddPregunta").append(optionP);

        $.ajax({
            type: "POST",
            url: "../../Api/Preguntas/CargarPreguntasPorCategoria",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Periodos = data;
                    $(Periodos).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.PreguntaId);

                        $("#ddPregunta").append(option);
                    });
                    //para recuperar los demas datos. 
                }
            }
        });
    }
    //end Categorias

    //change Al seleccionar los periodos
    $('#ddPeriodo').change(function () {

        CargarTipoCarrera()
        $("#ddCategoria").empty();
        var optionPpc = $(document.createElement('option'));
        optionPpc.text('--Seleccionar--');
        optionPpc.val('');
        $("#ddCategoria").append(optionPpc);

        $("#ddPregunta").empty();
        var optionPp = $(document.createElement('option'));
        optionPp.text('--Seleccionar--');
        optionPp.val('');
        $("#ddPregunta").append(optionPp);

    });
    //end change peridodos

    //Change tipocarrera
    $('#ddTipoCarrera').change(function () {


        $("#ddPregunta").empty();
        var optionPp = $(document.createElement('option'));
        optionPp.text('--Seleccionar--');
        optionPp.val('');
        $("#ddPregunta").append(optionPp);

    });
    //end tipo carrera


    //change Al seleccionar los Categorias
    $('#ddCategoria').change(function () {

        var TipoCarreraId = $("#ddTipoCarrera").val();

        CargarEncuestas();
        CargarPreguntasPorCategorias();

    });



    //Cargar Preguntas por categoria
    function CargarPreguntasPorCategorias() {
        var ConfiguracionEncuestaId = sessionStorage.getItem("ConfiguracionEncuestaId");
        var CategoriaId = $("#ddCategoria").val();
        $("#ddPregunta").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('');
        $("#ddPregunta").append(optionP);
        if (CategoriaId == "") { CategoriaId = -1; }
        if (CategoriaId != "") {
            //$("#slcPeriodo").empty();


            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "../../Api/Preguntas/CargarPreguntasPorCategoria",
                data: JSON.stringify({ ConfiguracionEncuestaId: ConfiguracionEncuestaId, CategoriaId: CategoriaId }),
                dataType: "json",
                success: function (data) {
                    if (data != null) {
                        Preguntas = data;
                        $(Preguntas).each(function () {
                            var option = $(document.createElement('option'));

                            option.text(this.Descripcion);
                            option.val(this.PreguntaId);

                            $("#ddPregunta").append(option);
                        });
                        //para recuperar los demas datos. 
                    }
                }

            });
        }
        else {
            return false;
        }
    }


    //Guarda Encuesta 
    $('#btnAgregar').click(function () {
        if (form2.valid() == false) { return false; }

        var Usuario = sessionStorage.getItem("Usuario");
        var ConfiguracionEncuestaId = sessionStorage.getItem("ConfiguracionEncuestaId");

        var datos = {
            ConfiguracionEncuestaId: ConfiguracionEncuestaId,
            PreguntaId: $('#ddPregunta').val(),
            IdUsuario: Usuario
        };

        $.ajax({
            type: "PUT",
            url: "../../Api/Preguntas/GuardarEncuesta",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data == "Correcto") {

                    alertify.alert("Sus datos se guardaron correctamente");
                    CargarEncuestas();
                    CargarPreguntasPorCategorias();
                    //TraerDocentes();
                } else {
                    $('#Load').modal('hide');
                    alertify.alert("Error al guardar los datos");
                }
            }
        });
    });

    //Cargar encuestas por por periodo
    //CargarPreguntasSist();
    function CargarEncuestas() {
        $('#Load').modal('show');

        var ConfiguracionEncuestaId = sessionStorage.getItem("ConfiguracionEncuestaId");
        var CategoriaId = $('#ddCategoria').val();
        if (CategoriaId == "") { CategoriaId = -1; }

        var datos = {
            //PeriodoId:$('#ddPeriodo').val() ,
            ConfiguracionEncuestaId: ConfiguracionEncuestaId,
            CategoriaId: CategoriaId
        };

        $.ajax({
            type: "POST",
            url: "../../Api/Preguntas/ObtenerEncuesta",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    CargarTablaPreguntas(data);
                } else {
                    $('#Load').modal('hide');
                    return false;
                }
            }
        });

    }



    function CargarTablaPreguntas(data) {
        tblDocentes = $('#tblPReguntas').dataTable({
            "aaData": data,
            "aoColumns": [

                { "mDataProp": "Descripcion" },
                { "mDataProp": "CategoriaDescripcion" },
                {
                    "mDataProp": "EncuestaId",
                    "mRender": function (data) {
                        return "<u><a href='' style='font-weight: 600;color: #0275d8;' onclick='return false;'>" + "Eliminar" + " </a></u> ";
                    }
                }

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


    $('#tblPReguntas').on("click", "a", function () {
        var row = this.parentNode.parentNode;
        var rowadd = tblDocentes.fnGetData($(this).closest('tr'));

        // sessionStorage.setItem("EncuestaId", rowadd.EncuestaId);

        //alert(rowadd.EncuestaId);
        //window.open("historial-detalles.html", "_parent");

        datos = {
            EncuestaId: rowadd.EncuestaId
        };

        $.ajax({
            type: "DELETE",
            url: "../../Api/Preguntas/BorraPreguntaEncuesta",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data == "Correcto") {
                    CargarEncuestas();
                    CargarCategorias();
                    CargarPreguntasPorCategorias();
                    alertify.alert("Se elimino correctamente.");
                } else {
                    $('#Load').modal('hide');
                    return false;
                }
            }
        });





    });


    //Guarda configuracion 
    $("#btnAgregaConfiguracion").click(function () {
        if (form.valid() == false) { return false; }
        // $('#Load').modal('show');
        var Usuario = sessionStorage.getItem("Usuario");
        var datos = {
            PeriodoId: $('#ddPeriodo').val(),
            TipoCarreraId: $('#ddTipoCarrera').val(),
            UsuarioId: Usuario
        };
        $.ajax(
            {
                type: "PUT",
                url: "../../Api/Preguntas/GuardaConfiguracion",
                data: JSON.stringify(datos),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data != null) {
                        $('#Load').modal('hide');
                        alertify.alert(data);
                        CargarConfiguraciones();

                        //TraerDocentes();
                    } else {
                        $('#Load').modal('hide');
                        alertify.alert("Error, consulte a su administrador.");
                    }
                }
                , error: function (f) {
                    $('#Load').modal('hide');
                    alertify.alert("Error al guardar");
                }
            });
    });
    ///
    CargarConfiguraciones();
    function CargarConfiguraciones() {
        //$('#divDocMateria').hide();
        $('#Load').modal('show');
        //$("#slcPeriodo").empty();  
        $.ajax({
            type: "GET",
            url: "../../Api/Preguntas/ObtenerConfiguracion",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    $('#Load').modal('hide');
                    CargarTablaConfiguracion(data);
                    //para recuperar los demas datos. 
                }
                else { $('#Load').modal('hide'); }
            }
        });
    }
    //////
    function CargarTablaConfiguracion(datad) {
        tblConfiguracion = $('#tblConfiguracion').dataTable({
            "aaData": datad,
            "aoColumns": [

                { "mDataProp": "DescripcionPeriodo" }
                , { "mDataProp": "DescripcionTipoCarrera" }
                , { "mDataProp": "FechaInicio" }
                , { "mDataProp": "FechaFin" }
                , { "mDataProp": "Estatus" }
                , {
                    "mDataProp": "ConfiguracionEncuestaIdC",
                    "mRender": function (data) {
                        return "<u><a href='' id='a1' style='font-weight: 600;color: #0275d8;' onclick='return false;'>" + "Configurar" + " </a></u> ";
                    }
                }
                , {
                    "mDataProp": "ConfiguracionEncuestaId",
                    "mRender": function (data) {
                        return "<u><a href='' id='a2' style='font-weight: 600;color: #0275d8;' onclick='return false;'>" + "Cargar Preguntas" + " </a></u> ";
                    }
                }

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

    /////
    $('#tblConfiguracion').on("click", "a", function (event) {
        var row = this.parentNode.parentNode;
        var rowadd = tblConfiguracion.fnGetData($(this).closest('tr'));
        $('#HMHeader').text("Cargar Preguntas " + rowadd.DescripcionPeriodo + " " + rowadd.DescripcionTipoCarrera);
        // sessionStorage.setItem("EncuestaId", rowadd.EncuestaId);
        //alert(event.target.id);
        //alert(rowadd.EncuestaId);
        //window.open("historial-detalles.html", "_parent");


        datos = {
            EncuestaId: rowadd.ConfiguracionEncuestaId
        };

        sessionStorage.setItem("ConfiguracionEncuestaId", -1);
        sessionStorage.setItem("ConfiguracionEncuestaId", rowadd.ConfiguracionEncuestaId);


        if (event.target.id == "a2") {
            CargarCategorias();
            CargarPreguntasPorCategorias();
            //CargarEncuestas();
            $("#tblPReguntas").find("tr:gt(0)").remove();// $("#tblPReguntas").children().remove(); //$("#tblPReguntas tr").remove();
            $('#AgregaPreguntas').modal('show');
        }
        if (event.target.id == "a1") {

            $('#HMConfigura').text("Configura Encuesta " + rowadd.DescripcionPeriodo + " " + rowadd.DescripcionTipoCarrera);
            ObtenerConfiguracionPorId(rowadd.ConfiguracionEncuestaId);
            $('#ConfiguraEncuesta').modal('show');


        }
    });

    //Obtenemos configuracion de encuesta por Id 
    function ObtenerConfiguracionPorId(ConfiguracionEncuestaId) {
        datos = {
            ConfiguracionEncuestaId: ConfiguracionEncuestaId
        };

        $.ajax({
            type: "POST",
            url: "../../Api/Preguntas/ObtieneEncuestaPorId",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {

                    // $('#FechaInicio').val(data.FechaInicio);

                    var arr2 = data.FechaInicio.split("/");
                    var anio2 = arr2[2];
                    var mes2 = arr2[1];
                    var dia2 = arr2[0];

                    var arr = data.FechaFin.split("/");
                    var anio = arr[2];
                    var mes = arr[1];
                    var dia = arr[0];


                    $('#FechaInicio').val(anio2 + '-' + mes2 + '-' + dia2);
                    $('#FechaFin').val(anio + '-' + mes + '-' + dia); //data.FechaFin;//val(data.FechaFin);
                    $('#ddEstatus').val(data.Estatus);


                    //CargarEncuestas();
                    //alertify.alert("Se elimino correctamente.");
                } else {
                    $('#Load').modal('hide');
                    return false;
                }
            }
        });

    }
    /////
    //Actualizamos configuracion 
    $("#btnActualizar").click(function () {
        if (form3.valid() == false) { return false; }
        var Usuario = sessionStorage.getItem("Usuario");
        var datos = {
            ConfiguracionEncuestaId: sessionStorage.getItem("ConfiguracionEncuestaId"),
            FechaInicio: $('#FechaInicio').val(),
            FechaFin: $('#FechaFin').val(),
            Estatus: $('#ddEstatus').val(),
            UsuarioId: Usuario
        };
        $.ajax({
            type: "PUT",
            url: "../../Api/Preguntas/GuardaConfiguarionById",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    alertify.alert(data);
                    CargarConfiguraciones();
                    $('#FechaInicio').val('dd/mm/aaaa'); //val('aaaa-mm-dd');
                    $('#FechaFin').val('dd/mm/aaaa'); //val('aaaa-mm-dd');
                    $('#ddEstatus').val("");
                    $('#ConfiguraEncuesta').modal('hide');
                    //TraerDocentes();
                } else {
                    $('#Load').modal('hide');
                    alertify.alert("Error al guardar los datos");
                }
            }, error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error al guardar");

            }
        });
    });
    ///



    //end ready
});