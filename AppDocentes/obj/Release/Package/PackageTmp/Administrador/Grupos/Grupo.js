$(document).ready(function () {
    var tblGrupos, tblAlumnMater, tblAlumLibres;
    var AlumnosGuardar = {
        Alumnos: [],
        DocenteId: "",
        CarreraId: "",
        MateriaId: "",
        UsuarioId: "",
        PeriodoId: "",
        EsSabatino:false
    };
    CargarCarreras();

    function CargarCarreras() {
        $('#Load').modal('show');
        $("#cmbCarrera").empty();
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('-1');
        $("#cmbCarrera").append(optionP);

        $.ajax({
            type: "GET",
            url: "../../Api/Carrera/TraerCarreras",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    var Carreras = data;
                    $(Carreras).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.CarreraId);

                        $("#cmbCarrera").append(option);
                    });
                    Cargarperiodos();
                } else {
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function Cargarperiodos() {
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
                        option.val(this.PeriodoId);

                        $("#slcPeriodo").append(option);
                    });
                    CargarDocentes();
                } else {
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function CargarDocentes() {
        $.ajax({
            type: "GET",
            url: "../../Api/Docente/TraerDocentes2",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    var docetes = data;
                    $(docetes).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Nombre + ' ' + this.Paterno + ' ' + this.Materno);
                        option.val(this.DocenteId);

                        $("#slcDocente").append(option);
                    });
                    $("#slcDocente").selectpicker('refresh');
                    //$('#Load').modal('hide');
                    CargarGrupos();
                } else {
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function CargarMaterias(Carrera) {
        var mat = {
            CarreraId: Carrera
        };
        $.ajax({
            type: "POST",
            url: "../../Api/Materias/TraerMateriasCarrera",
            data: JSON.stringify(mat),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    var docetes = data;
                    $(docetes).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.MateriaId);

                        $("#slcMateria").append(option);
                    });
                    $("#slcMateria").selectpicker('refresh');
                    $('#Load').modal('hide');
                } else {
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function CargarMateriasN(Carrera,MateriaId, NombreC) {
        var mat = {
            CarreraId: Carrera
        };
        $.ajax({
            type: "POST",
            url: "../../Api/Materias/TraerMateriasCarrera",
            data: JSON.stringify(mat),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    var docetes = data;
                    $(docetes).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.MateriaId);

                        $("#slcMateria").append(option);
                    });
                    //$("#slcMateria").selectpicker('refresh');
                    var s = $("#slcMateria")[0];

                    $(s).selectpicker('refresh');
                    $(s).val(MateriaId);
                    $(s).selectpicker('refresh');

                    $('#Load').modal('hide');
                } else {
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function GuardarRelDocMaterCar(obj) {
        $.ajax({
            type: "Put",
            url: "../../Api/Grupo/GuardarDocenteCarreraMateria",
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    $('#ModalGrup').modal('hide');
                    alertify.alert("Se guardo correctamente.");
                    CrearTabla(data);
                } else {
                    alertify.alert("Error Al Guardar.");
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function CargarGrupos() {
        $.ajax({
            type: "Get",
            url: "../../Api/Grupo/TraerTodos",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    CrearTabla(data);
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function CrearTabla(data) {
        tblGrupos = $('#tblDocRel').dataTable({
            "aaData": data,
            "aoColumns": [
                {
                    "mDataProp": "NombreDocente",
                    "mRender": function (data) {
                        return "<button href='' class='btn warning' onclick='return false;'>" + data + " </button> ";
                    }
                },
                { "mDataProp": "CarreraS" },
                { "mDataProp": "PeriodoS" },
                { "mDataProp": "MateriaS" },
                {
                    "mDataProp": "EsSabatino",
                    "mRender": function (data) {
                        return data==true ? "Sabatino" : "Escolarizado";
                    }
                },
                {
                    "mDataProp": "DocenteMateriaId",
                    "mRender": function (data) {
                        return "<a href='' class='btn blue' onclick='return false;'>" + "Alumnos" + " </a> ";
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
                "search": "Buscar.. ",
            },
            "order": [[1, "desc"]]
        });
        $('#Load').modal('hide');
    }
    function ConsultarAlumnos(DTO) {
        var datos = {
            DocenteId: DTO.DocenteId,
            CarreraId: DTO.CarreraId,
            MateriaId: DTO.MateriaId,
            PeriodoId: DTO.PeriodoId,
            esSabatino: DTO.EsSabatino
        }

        $.ajax({
            type: "POST",
            url: "../../Api/Grupo/TraerAlumnos",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    CargarAlumnosDocentes(data.lstAlumnosDocenteMateria);
                    CargarAlumnosLibres(data.lstAlumnosLibres);
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function CargarAlumnosDocentes(data) {
        tblAlumnMater = $('#tblRelAlumnosE').dataTable({
            "aaData": data,
            "aoColumns": [
                { "mDataProp": "NumeroAlumno" },
                { "mDataProp": "Nombre" },
                { "mDataProp": "CarreraS" },
                {
                    "mDataProp": "NumeroAlumno",
                    "mRender": function (data) {
                        return "<a href='' class='btn bg-warning' onclick='return false;'>" + "Quitar" + " </a> ";
                    }
                },
            ],
            "lengthMenu": [[5, 30, 100, -1], [5, 30, 100, 'Todos']],    
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
                "search": "Buscar.. ",
            },
            "order": [[1, "desc"]]
        });
        $('#Load').modal('hide');
    }
    function CargarAlumnosLibres(data) {
        tblAlumLibres = $('#tblRelAlumnosA').dataTable({
            "aaData": data,
            "aoColumns": [
                { "mDataProp": "NumeroAlumno" },
                { "mDataProp": "Nombre" },
                { "mDataProp": "CarreraS" },
                {
                    "mDataProp": "NumeroAlumno",
                    "mRender": function (data) {
                        return '<label class="checkbox-inline"><input data-class="" type="checkbox" value=""> Seleccionar </label>';
                    }
                },
            ],
            "lengthMenu": [[5, 30, 100, -1], [5, 30, 100, 'Todos']],
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
                "search": "Buscar.. ",
            },
            "order": [[1, "desc"]]
        });
        $('#Load').modal('hide');
    }
    function GuardarAlumnos(DocenteId, CarreraId, MateriaId, PeriodoId, UsuarioId, EsSabatino, Alumnos) {
        var Datos = {
            DocenteId: DocenteId,
            CarreraId: CarreraId,
            MateriaId: MateriaId,
            PeriodoId: PeriodoId,
            UsuarioId: UsuarioId,
            EsSabatino: EsSabatino,
            Alumnos: Alumnos
        };
        $.ajax({
            type: "PUT",
            url: "../../Api/Grupo/GuardarAlumnos",
            data: JSON.stringify(Datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    AlumnosGuardar.Alumnos = [];
                    alertify.alert("Alumnos Guardados correctamente");
                    ConsultarAlumnos(data);
                } else {
                    alertify.alert("Error, intente de nuevo");
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
    function EliminarAlumno(DocenteId, CarreraId, MateriaId, PeriodoId,EsSabatino, AlumnoId) {
        var Datos = {
            DocenteId: DocenteId,
            CarreraId: CarreraId,
            MateriaId: MateriaId,
            PeriodoId: PeriodoId,
            EsSabatino: EsSabatino,
            AlumnoId: AlumnoId
        }
        $.ajax({
            type: "DELETE",
            url: "../../Api/Grupo/EliminarAlumno",
            data: JSON.stringify(Datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    alertify.alert("Alumnos eliminados correctamente");
                    ConsultarAlumnos(data);
                } else {
                    alertify.alert("Error, intente de nuevo");
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
    

    $('#cmbCarrera').on('change', function () {
        $('#Load').modal('show');
        var selec = $('#cmbCarrera').val();
        if (selec == -1) {
            return false;
        }
        CargarMaterias(selec);
    });
    $('#btnAgregar').on('click', function () {
        if ($('#cmbCarrera').val() === "-1") { return false; }
        if ($('#slcPeriodo').val() === "-1") { return false; }
        if ($('#slcDocente').val() === "") { return false; }
        if ($('#slcMateria').val() === "") { return false; }
        $('#Load').modal('show');
        var Usuario = sessionStorage.getItem("Usuario");
        var Sabatino = $('#chkSabatino');
        Sabatino = Sabatino[0].checked;

        var objG = {
            CarreraId: $('#cmbCarrera').val(),
            PeriodoId: $('#slcPeriodo').val(),
            DocenteId: $('#slcDocente').val(),
            MateriaId: $('#slcMateria').val(),
            Sabatino: Sabatino,
            UsuarioId: Usuario
        };

        GuardarRelDocMaterCar(objG);
    });
    $('#btnNuevoGrupo').on('click', function () {
        $('#frmGrupo').trigger("reset");
        $('#slcDocente').val("");
        $('#slcMateria').val('destroy');
        $('#ModalGrup').modal('show');
        $('#hTitulo').text('Nuevo Grupo');
    });
    $('#btnRegresar').on('click', function () {
        AlumnosGuardar = [];
        $('#divRelDocente').show();
        $('#RelAlumnos').hide();
    });
    $('#tblDocRel').on('click', 'a', function () {
        $('#Load').modal('show');
        var row = this.parentNode.parentNode;
        var rowadd = tblGrupos.fnGetData($(this).closest('tr'));
        //Cargar Objeto
        AlumnosGuardar.DocenteId = rowadd.DocenteId;
        AlumnosGuardar.CarreraId = rowadd.CarreraId;
        AlumnosGuardar.MateriaId = rowadd.MateriaId;
        AlumnosGuardar.PeriodoId = rowadd.PeriodoId;
        AlumnosGuardar.EsSabatino = rowadd.EsSabatino;
        AlumnosGuardar.UsuarioId = sessionStorage.getItem("Usuario");
        AlumnosGuardar.Alumnos = [];

        ConsultarAlumnos(rowadd);
        $('#divRelDocente').hide();
        $('#RelAlumnos').show();
    });
    $('#tblDocRel').on('click', 'button', function () {
        $('#frmGrupo').trigger("reset");
        $('#slcDocente').val("");
        $('#slcMateria').val('destroy');
        $('#ModalGrup').modal('show');
        $('#hTitulo').text('Modificar Grupo');

        var row = this.parentNode.parentNode;
        var rowadd = tblGrupos.fnGetData($(this).closest('tr'));

        $('#cmbCarrera').val(rowadd.CarreraId);
        $('#slcPeriodo').val(rowadd.PeriodoId);
        $('#slcDocente').selectpicker(rowadd.DocenteId, rowadd.NombreDocente);
        CargarMateriasN(rowadd.CarreraId,rowadd.MateriaId, rowadd.MateriaS);
        
        $("#slcDocente").change();
        $("#slcMateria").change();
        var Sabatino = $('#chkSabatino');
        if (rowadd.EsSabatino) {
            Sabatino = Sabatino[0].checked;
            Sabatino = true;
        }
    });
    $('#tblRelAlumnosA').on('click', 'input', function () {
        var row = this.parentNode.parentNode;
        var rowadd = tblAlumLibres.fnGetData($(this).closest('tr'));

        if (this.checked) {
            var tr = this.parentNode.parentNode.parentNode;
            tr.style.backgroundColor = "darkred";
            tr.style.color = "white";
            this.dataset.class = this.parentNode.parentNode.parentNode.className;
            AlumnosGuardar.Alumnos.push(rowadd.NumeroAlumno);
        } else {
            var tr = this.parentNode.parentNode.parentNode;
            tr.style.backgroundColor = "";
            tr.style.color = "";
            $(this).addClass(this.dataset.class);

            var index = AlumnosGuardar.Alumnos.indexOf(rowadd.NumeroAlumno);
            if (index != -1)
                AlumnosGuardar.Alumnos.splice(index, 1);
        }
    });
    $('#btnAgregarAl').on('click', function () {
        if (AlumnosGuardar.Alumnos.length == 0) {
            alertify.alert("Favor de seleccinar para poder continuar");
            return false;
        }
        $('#Load').modal('show');
        var Alumnosids="";
        $(AlumnosGuardar.Alumnos).each(function (ind,dat) {
            Alumnosids += dat + ",";
        });
        Alumnosids = Alumnosids.substring(0, Alumnosids.length-1);
        
        GuardarAlumnos(AlumnosGuardar.DocenteId, AlumnosGuardar.CarreraId,
                AlumnosGuardar.MateriaId, AlumnosGuardar.PeriodoId,
                AlumnosGuardar.UsuarioId, AlumnosGuardar.EsSabatino, Alumnosids);
    });
    $('#tblRelAlumnosE').on('click', 'a', function () {
        $('#Load').modal('show');
        var row = this.parentNode.parentNode;
        var rowadd = tblAlumnMater.fnGetData($(this).closest('tr'));

        EliminarAlumno(AlumnosGuardar.DocenteId, AlumnosGuardar.CarreraId,
                AlumnosGuardar.MateriaId, AlumnosGuardar.PeriodoId,AlumnosGuardar.EsSabatino, rowadd.NumeroAlumno);
    });
    $('#btnSalir').click(function () {
        sessionStorage.clear();
        window.open("../Administrativo/Index.html", "_parent");
    });
});
