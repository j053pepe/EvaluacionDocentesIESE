$(document).ready(function () {

    var form = $('#frmMateria');
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
            ddCategoria: {
                required: true
            },
            ddPregunta: {
                required: true
            },
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
            type: "POST",
            url: "../WS/Periodo.asmx/TraerPeriodos",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Periodos = data.d;
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
            type: "POST",
            url: "../WS/Preguntas.asmx/CargaTipoCarrera",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Periodos = data.d;
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
            type: "POST",
            url: "../WS/Preguntas.asmx/CargaCategorias",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Periodos = data.d;
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
    function CargarPreguntas() {
        //$('#divDocMateria').hide();
        //$('#Load').modal('show');
        //$("#slcPeriodo").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('');
        $("#ddPregunta").append(optionP);

        $.ajax({
            type: "POST",
            url: "../WS/Preguntas.asmx/CargarPreguntas",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Periodos = data.d;
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

        CargarCategorias();
        $("#ddPregunta").empty();
        var optionPp = $(document.createElement('option'));
        optionPp.text('--Seleccionar--');
        optionPp.val('');
        $("#ddPregunta").append(optionPp);

    });
    //end tipo carrera


    //change Al seleccionar los Categorias
    $('#ddCategoria').change(function () {
        var CategoriaId = $("#ddCategoria").val();
        var TipoCarreraId = $("#ddTipoCarrera").val();
        $("#ddPregunta").empty();
        var optionP = $(document.createElement('option'));
            optionP.text('--Seleccionar--');
            optionP.val('');
            $("#ddPregunta").append(optionP);
        if (CategoriaId != "" && TipoCarreraId!="")
        {
            //$("#slcPeriodo").empty();
            

            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "../WS/Preguntas.asmx/CargarPreguntasPorCategoria",
                data: "{CategoriaId:'" + CategoriaId + ",TipoCarreraId:'" + TipoCarreraId + "'}",
                dataType: "json",
                success: function (data) {
                    if (data != null) {
                        Preguntas = data.d;
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

    });





//end ready
});