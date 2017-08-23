$(document).ready(function () {
    var Periodos;
    var Carreras;
    var tblMaterias;
    var tblDocMaterias;
    var form = $('#frmMateria');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    $('#divbtnDocente').hide();
    CargarPeriodos();
    Docentes();
    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtNombreMateria: {
                required: true,
                minlength: 4
            },
            txtClaveMateria: {
                required: true,
                minlength: 2
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

    $('#NuevaMateria').on('hidden.bs.modal', function () {
        $("#txtClaveMateria").val('');
        $("#txtNombreMateria").val('');
    });
    $('#btnAtras').click(function () {
        $('#divDocMateria').hide();
        $('#divMaterias').show();
        $('#divbtnMateria').show();
        $('#divbtnDocente').hide();

    });
    $("#btnGuardar").click(function () {
        if (form.valid() == false) { return false; }
        var Materia = {
            MateriaId: $("#txtClaveMateria").val(),
            Descripcion: $("#txtNombreMateria").val()
        };
        GuardarM(Materia);
    });

    function GuardarM(dats) {
        $('#Load').modal('show');
        $.ajax({
            type: "POST",
            url: "../../Api/Materias/GuardarMateria",
            data: JSON.stringify(dats),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (d) {
                if (d == true) {
                    alertify.alert("Materia Guardada");
                    $("#btnCerrar").click();
                    CargarMaterias();
                } else {
                    alertify.alert("Error Al Guardar");
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                alertify.alert("Error Al Guardar");
                $('#Load').modal('hide');
            }
        });
    }

    function CargarPeriodos() {
        $('#divDocMateria').hide();
        $('#Load').modal('show');
        $("#slcPeriodo").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('-1');
        $("#slcPeriodo").append(optionP);

        $.ajax({
            type: "Get",
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

                        $("#slcPeriodo").append(option);
                    });
                    PeriodoPopup();
                    TraerCarreras();
                }
            }
        });
    }

    function PeriodoPopup() {
        if (document.getElementById('slcPeriodoP') != null) {
            $("#slcPeriodoP").empty();
            var optionP = $(document.createElement('option'));
            optionP.text('--Seleccionar--');
            optionP.val('-1');
            $("#slcPeriodoP").append(optionP);
            $(Periodos).each(function () {
                var option = $(document.createElement('option'));

                option.text(this.Descripcion);
                option.val(this.PeriodoId);

                $("#slcPeriodoP").append(option);
            });
        }
    }

    function TraerCarreras() {
        $("#slcCarrera").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('-1');
        $("#slcCarrera").append(optionP);

        $.ajax({
            type: "Get",
            url: "../../Api/Carrera/TraerCarreras",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Carreras = data;
                    $(Carreras).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.CarreraId);

                        $("#slcCarrera").append(option);
                    });
                    CarrerasPop();
                    CargarMaterias();
                }
            }
        });
    }

    function CarrerasPop() {
        if (document.getElementById('slcCarreraP') != null) {
            $("#slcCarreraP").empty();
            var optionP = $(document.createElement('option'));
            optionP.text('--Seleccionar--');
            optionP.val('-1');
            $("#slcCarreraP").append(optionP);
            $(Carreras).each(function () {
                var option = $(document.createElement('option'));

                option.text(this.Descripcion);
                option.val(this.CarreraId);

                $("#slcCarreraP").append(option);
            });
        }
    }

    $('#tblMaterias').on("click", "a", function () {
        $('#Load').modal('show');
        var row = this.parentNode.parentNode;
        var rowadd = tblMaterias.fnGetData($(this).closest('tr'));
        CargarDocentesMateria(rowadd);
        //$('#txtClaveMateriaA').val(rowadd.MateriaId);
        //$('#txtNombreMateriaA').val(rowadd.Descripcion);

        //$('#Asociar').modal('show');
    });

    function CargarDocentesMateria(objMateria) {
        $('#divMaterias').hide();
        $('#divbtnMateria').hide();
        $('#divbtnDocente').show();
        $('#lblMAteria').text(objMateria.Descripcion);
        $('#divDocMateria').show();
        $('#txtClaveMateriaA').val(objMateria.MateriaId);
        $('#txtNombreMateriaA').val(objMateria.Descripcion);
        var mat = {
            MateriaId: objMateria.MateriaId
        };
        CargarMateriasDocente(mat);
    }

    function CargarMateriasDocente(mat) {
        $.ajax({
            type: "POST",
            url: "../../Api/Materias/TraerDocentesM",
            data: JSON.stringify(mat),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                tblDocMaterias = $('#tblDocMaterias').dataTable({
                    "aaData": data,
                    "aoColumns": [
                        { "mDataProp": "DocenteId" },
                        { "mDataProp": "Nombre" },
                        { "mDataProp": "Carrera" },
                        { "mDataProp": "Periodo" },
                        { "mDataProp": "Sabatino" },
                        { "mDataProp": "Usuario" },
                    ],
                    "lengthMenu": [[10, 20, 50, 100, -1], [10, 20, 50, 100, 'Todos']],
                    "searching": true,
                    "ordering": true,
                    "info": false,
                    "async": true,
                    "bDestroy": true,
                    "language": {
                        "lengthMenu": "_MENU_  Registros",
                        "paginate": {
                            "previous": "Anterior",
                            "next": "Siguiente"
                        },
                        "search": "Buscar Docente ",
                    },
                    "order": [[1, "desc"]]
                });
                $('#Load').modal('hide');
            }
        });
    }
    $('#Asociar').on('hidden.bs.modal', function () {
        $("#txtClaveMateriaA").val('');
        $("#txtNombreMateriaA").val('');
        $("#slcCarreraP").val(-1);
        $("#slcPeriodoP").val(-1);
        //$("#slcCarreraP").val(-1);
    });

    function CargarMaterias() {

        $.ajax({
            type: "GET",
            url: "../../Api/Materias/CargarMaterias",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                tblMaterias = $('#tblMaterias').dataTable({
                    "aaData": data,
                    "aoColumns": [
                        { "mDataProp": "MateriaId" },
                        { "mDataProp": "Descripcion" },
                        {
                            "mDataProp": "MateriaId",
                            "mRender": function (data) {
                                return "<a href='' class='btn bg-info ' onclick='return false;'>" + "Ver Docentes" + " </a> ";
                            }
                        },
                    ],
                    "lengthMenu": [[20, 50, 100, -1], [20, 50, 100, 'Todos']],
                    "searching": true,
                    "ordering": true,
                    "info": false,
                    "async": true,
                    "bDestroy": true,
                    "language": {
                        "lengthMenu": "_MENU_  Registros",
                        "paginate": {
                            "previous": "Anterior",
                            "next": "Siguiente"
                        },
                        "search": "Buscar Materia ",
                    },
                    "order": [[1, "desc"]]
                });
                $('#Load').modal('hide');
            }
        });
    }

    function Docentes() {
        $("#slcDocente").empty();

        $.ajax({
            type: "GET",
            url: "../../Api/Docente/TraerDocentes",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var docetes = data;
                $(docetes).each(function () {
                    var option = $(document.createElement('option'));

                    option.text(this.Nombre);
                    option.val(this.DocenteId);

                    $("#slcDocente").append(option);
                });
                $("#slcDocente").selectpicker('refresh');
            }
        });
    }

    $('#btnGuardarRelacion').click(function () {
        var Usuario = sessionStorage.getItem("Usuario");
        var ClaveMateria = $('#txtClaveMateriaA').val();
        var Carrera = $('#slcCarreraP').val();
        var Periodo = $('#slcPeriodoP').val();
        var Docente = $('#slcDocente').val();
        var Sabatino = $('#chkSabatino');
        Sabatino = Sabatino[0].checked;

        var Datos = {
            Materia: {
                MateriaId: ClaveMateria,
                CarreraId: Carrera,
                PeriodoId: Periodo,
                DocenteId: Docente,
                EsSabatino: Sabatino,
                UsuarioId: Usuario
            }
        };
        guardarRel("../../Api/Materias/GuardarDocenteMateria", Datos);
    });

    function guardarRel(url, datos) {
        $('#Load').modal('show');
        $.ajax({
            type: "Put",
            url: url,
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (d) {
                if (d == true) {
                    alertify.alert("Guardado");
                    $(Asociar).modal("hide");
                    var j = { MateriaId: datos.Materia.MateriaId };
                    CargarMateriasDocente(j);
                } else {
                    alertify.alert("Error Al Guardar");
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                alertify.alert("Error Al Guardar");
                $('#Load').modal('hide');
            }
        });
    }
});