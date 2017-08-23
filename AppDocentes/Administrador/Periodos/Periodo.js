$(function init() {
    var tblPeriodos;


    var form = $('#frmPeriodo');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        //rules: {
        //    txtArchivo: {
        //        required: true
        //    }
        //    ,
        //}
        //,
        messages: {
            ddMesInicio: "Seleccione mes",
            ddAnioInicio: "Seleccione año",
            ddMesFin: "Seleccione mes",
            ddAnioFin: "Seleccione año"
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



    CargarPeriodos();
    function CargarPeriodos() {
        $('#Load').modal('show');
        $("#slcPeriodo").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('-1');
        $("#slcPeriodo").append(optionP);

        $.ajax({
            type: "GET",
            url: "../../Api/Periodo/TraerPeriodos",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    var Periodos = data;
                    $(Periodos).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.CarreraId);

                        $("#slcPeriodo").append(option);
                    });
                    anios();
                }
            }
        });
    }


    function anios() {
        var today = new Date();
        var year = today.getFullYear();
        var Minimo = 2;
        var Mayor = 3;

        var contador = year - Minimo;
        var Final = year + Mayor;

        var option = $(document.createElement('option'));
        option.text("--Seleccione--");
        option.val("");
        var option2 = $(document.createElement('option'));
        option2.text("--Seleccione--");
        option2.val("");


        $("#ddAnioInicio").append(option2);
        $("#ddAnioFin").append(option);

        for (var i = contador; i < Final; i++) {
            var optionI = $(document.createElement('option'));
            optionI.text(i);
            optionI.val(i);
            var optionIs = $(document.createElement('option'));
            optionIs.text(i);
            optionIs.val(i);

            $("#ddAnioFin").append(optionI);
            $("#ddAnioInicio").append(optionIs);

        }
        CargarPeriodosEnSistema();

    }


    $('#btnGuardar').click(function () {
        if (form.valid() == false) { return false; }
        var Usuario = sessionStorage.getItem("Usuario");

        $('#Load').modal('show');
        var datos = {
            MesInicio: $('#ddMesInicio').val(),
            MesFin: $('#ddMesFin').val(),
            AnioInicio: $('#ddAnioInicio').val(),
            AnioFin: $('#ddAnioFin').val(),
            UsuarioId: Usuario
        };

        $.ajax({
            type: "PUT",
            url: "../../Api/Periodo/AgregaPeriodo",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    alertify.alert(data);
                    CargarPeriodosEnSistema();
                } else {
                    $('#Load').modal('hide');
                    alertify.alert("Error, consulte a su administrador.");
                }
                //CargarEncuestas();
                //CargarPreguntasPorCategorias();

                //TraerDocentes();
                //} else  {
                //    $('#Load').modal('hide');
                //    alertify.alert(data.d);
                //}
            }
        });




    });



    //Cargamos periodos
    function CargarTablaPeriodos(data) {
        tblPeriodos = $('#tblPeriodosSist').dataTable({
            "aaData": data,
            "aoColumns": [

                { "mDataProp": "Descripcion" },
                {
                    "mDataProp": "PeriodoId",
                    "mRender": function (data) {
                        return "<u><a href=''   style='font-weight: 600;color: #0275d8;' onclick='return false;'>" + "Eliminar" + " </a></u> ";
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

    $('#tblPeriodosSist').on("click", "a", function (event) {
        var row = this.parentNode.parentNode;
        var rowadd = tblPeriodos.fnGetData($(this).closest('tr'));


        var PeriodoId = rowadd.PeriodoId;
        datos = {
            PeriodoId: PeriodoId
        };
        $.ajax({
            type: "DELETE",
            url: "../../Api/Periodo/BorrarPeriodo",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data == "Correcto") {
                    $('#Load').modal('hide');
                    CargarPeriodosEnSistema();
                    alertify.alert("Se elimino correctamente.");
                } else {
                    $('#Load').modal('hide');
                    alertify.alert("Error, consulte a su administrador.");
                    return false;
                }
            }
        });

    });


    function CargarPeriodosEnSistema() {


        $.ajax({
            type: "GET",
            url: "../../Api/Periodo/TraerPeriodos",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    CargarTablaPeriodos(data);
                }
            }
        });
    }

});