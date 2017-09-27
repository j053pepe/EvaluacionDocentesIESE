$(document).ready(function init() {
    var Funciones = {
        tblGrupos: "",
        tblAlumnMater: "",
        tblAlumLibres: "",
        AlumnosGuardar: {
            Alumnos: [],
            DocenteId: "",
            CarreraId: "",
            MateriaId: "",
            UsuarioId: "",
            PeriodoId: "",
            EsSabatino: false
        },
        CargarCarreras: function () {
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
                       Funciones.Cargarperiodos();
                    } else {
                        $('#Load').modal('hide');
                    }
                },
                error: function (f) {
                    $('#Load').modal('hide');
                    alertify.alert("Error, intente mas tarde");
                }
            });
        },
        Cargarperiodos: function () {
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
                       Funciones.CargarDocentes();
                    } else {
                        $('#Load').modal('hide');
                    }
                },
                error: function (f) {
                    $('#Load').modal('hide');
                    alertify.alert("Error, intente mas tarde");
                }
            });
        },
        CargarDocentes: function () {
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
                        Funciones.CargarGrupos();
                    } else {
                        $('#Load').modal('hide');
                    }
                },
                error: function (f) {
                    $('#Load').modal('hide');
                    alertify.alert("Error, intente mas tarde");
                }
            });
        },
        CargarMaterias: function (Carrera) {
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
        },
        CargarMateriasN: function (Carrera, MateriaId, NombreC) {
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
        },
        GuardarRelDocMaterCar: function (obj) {
            $.ajax({
                type: "Put",
                url: "../../Api/Grupo/GuardarDocenteCarreraMateria",
                data: JSON.stringify(obj),
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data != null) {
                        $('#ModalGrup').modal('hide');
                        alertify.alert("Se guardo correctamente.");
                        Funciones.CrearTabla(data);
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
        },
        CargarGrupos: function () {
            $.ajax({
                type: "Get",
                url: "../../Api/Grupo/TraerTodos",
                data: "",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data != null) {
                        Funciones.CrearTabla(data);
                    }
                },
                error: function (f) {
                    $('#Load').modal('hide');
                    alertify.alert("Error, intente mas tarde");
                }
            });
        },
        CrearTabla: function (data) {
            Funciones.tblGrupos = $('#tblDocRel').dataTable({
                "aaData": data,
                "aoColumns": [
                    {
                        "mDataProp": "NombreDocente",
                        "mRender": function (data) {
                            return "<button href='' class='btn btn-primary' onclick='return false;'>" + data + " </button> ";
                        }
                    },
                    { "mDataProp": "CarreraS" },
                    { "mDataProp": "PeriodoS" },
                    { "mDataProp": "MateriaS" },
                    {
                        "mDataProp": "EsSabatino",
                        "mRender": function (data) {
                            return data == true ? "Sabatino" : "Escolarizado";
                        }
                    },
                    {
                        "mDataProp": "DocenteMateriaId",
                        "mRender": function (data) {
                            return "<a href='' class='btn btn-warning' onclick='return false;'>" + "Alumnos" + " </a> ";
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
        },
        ConsultarAlumnos: function (DTO) {
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
                        Funciones.CargarAlumnosDocentes(data.lstAlumnosDocenteMateria);
                        Funciones.CargarAlumnosLibres(data.lstAlumnosLibres);
                    }
                },
                error: function (f) {
                    $('#Load').modal('hide');
                    alertify.alert("Error, intente mas tarde");
                }
            });
        },
        CargarAlumnosDocentes: function (data) {
            Funciones.tblAlumnMater = $('#tblRelAlumnosE').dataTable({
                "aaData": data,
                "aoColumns": [
                    { "mDataProp": "NumeroAlumno" },
                    { "mDataProp": "Nombre" },
                    { "mDataProp": "CarreraS" },
                    {
                        "mDataProp": "NumeroAlumno",
                        "mRender": function (data) {
                            return "<a href='' class='btn btn-danger' onclick='return false;'>" + "Quitar" + " </a> ";
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
        },
        CargarAlumnosLibres: function (data) {
            Funciones.tblAlumLibres = $('#tblRelAlumnosA').dataTable({
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
        },
        GuardarAlumnos: function (DocenteId, CarreraId, MateriaId, PeriodoId, UsuarioId, EsSabatino, Alumnos) {
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
                        Funciones.AlumnosGuardar.Alumnos = [];
                        alertify.alert("Alumnos Guardados correctamente");
                        Funciones.ConsultarAlumnos(data);
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
        },
        EliminarAlumno: function (DocenteId, CarreraId, MateriaId, PeriodoId, EsSabatino, AlumnoId) {
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
                        Funciones.ConsultarAlumnos(data);
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
        },
        cmbCarrerachange: function () {
            $('#Load').modal('show');
            var selec = $('#cmbCarrera').val();
            if (selec == -1) {
                return false;
            }
           Funciones.CargarMaterias(selec);
        },
        btnAgregarclick: function () {
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

            Funciones.GuardarRelDocMaterCar(objG);
        },
        btnNuevoGrupoclick: function () {
            $('#frmGrupo').trigger("reset");
            $('#slcDocente').val("");
            $('#slcMateria').val('destroy');
            $('#ModalGrup').modal('show');
            $('#hTitulo').text('Nuevo Grupo');
        },
        btnRegresarclick: function () {
            Funciones.AlumnosGuardar = [];
            $('#divRelDocente').show();
            $('#RelAlumnos').hide();
        },
        tblDocRelclicka: function () {
            $('#Load').modal('show');
            var row = this.parentNode.parentNode;
            var rowadd = Funciones.tblGrupos.fnGetData($(this).closest('tr'));
            //Cargar Objeto
            Funciones.AlumnosGuardar.DocenteId = rowadd.DocenteId;
            Funciones.AlumnosGuardar.CarreraId = rowadd.CarreraId;
            Funciones.AlumnosGuardar.MateriaId = rowadd.MateriaId;
            Funciones.AlumnosGuardar.PeriodoId = rowadd.PeriodoId;
            Funciones.AlumnosGuardar.EsSabatino = rowadd.EsSabatino;
            Funciones.AlumnosGuardar.UsuarioId = sessionStorage.getItem("Usuario");
            Funciones.AlumnosGuardar.Alumnos = [];

            Funciones.ConsultarAlumnos(rowadd);
            $('#divRelDocente').hide();
            $('#RelAlumnos').show();
        },
        tblDocRelclickbutton: function () {
            $('#frmGrupo').trigger("reset");
            $('#slcDocente').val("");
            $('#slcMateria').val('destroy');
            $('#ModalGrup').modal('show');
            $('#hTitulo').text('Modificar Grupo');

            var row = this.parentNode.parentNode;
            var rowadd = Funciones.tblGrupos.fnGetData($(this).closest('tr'));

            $('#cmbCarrera').val(rowadd.CarreraId);
            $('#slcPeriodo').val(rowadd.PeriodoId);
            $('#slcDocente').selectpicker(rowadd.DocenteId, rowadd.NombreDocente);
            Funciones.CargarMateriasN(rowadd.CarreraId, rowadd.MateriaId, rowadd.MateriaS);

            $("#slcDocente").change();
            $("#slcMateria").change();
            var Sabatino = $('#chkSabatino');
            if (rowadd.EsSabatino) {
                Sabatino = Sabatino[0].checked;
                Sabatino = true;
            }
        },
        tblRelAlumnosAclickinput: function () {
            var row = this.parentNode.parentNode;
            var rowadd = Funciones.tblAlumLibres.fnGetData($(this).closest('tr'));

            if (this.checked) {
                var tr = this.parentNode.parentNode.parentNode;
                tr.style.backgroundColor = "darkred";
                tr.style.color = "white";
                this.dataset.class = this.parentNode.parentNode.parentNode.className;
                Funciones.AlumnosGuardar.Alumnos.push(rowadd.NumeroAlumno);
            } else {
                var tr = this.parentNode.parentNode.parentNode;
                tr.style.backgroundColor = "";
                tr.style.color = "";
                $(this).addClass(this.dataset.class);

                var index = AlumnosGuardar.Alumnos.indexOf(rowadd.NumeroAlumno);
                if (index != -1)
                    Funciones.AlumnosGuardar.Alumnos.splice(index, 1);
            }
        },
        btnAgregarAlclick: function () {
            if (Funciones.AlumnosGuardar.Alumnos.length == 0) {
                alertify.alert("Favor de seleccinar para poder continuar");
                return false;
            }
            $('#Load').modal('show');
            var Alumnosids = "";
            $(Funciones.AlumnosGuardar.Alumnos).each(function (ind, dat) {
                Alumnosids += dat + ",";
            });
            Alumnosids = Alumnosids.substring(0, Alumnosids.length - 1);

            Funciones.GuardarAlumnos(Funciones.AlumnosGuardar.DocenteId, Funciones.AlumnosGuardar.CarreraId,
                    Funciones.AlumnosGuardar.MateriaId, Funciones.AlumnosGuardar.PeriodoId,
                    Funciones.AlumnosGuardar.UsuarioId, Funciones.AlumnosGuardar.EsSabatino, Alumnosids);
        },
        tblRelAlumnosEclicka: function () {
            $('#Load').modal('show');
            var row = this.parentNode.parentNode;
            var rowadd = Funciones.tblAlumnMater.fnGetData($(this).closest('tr'));

            Funciones.EliminarAlumno(Funciones.AlumnosGuardar.DocenteId, Funciones.AlumnosGuardar.CarreraId,
                    Funciones.AlumnosGuardar.MateriaId, Funciones.AlumnosGuardar.PeriodoId, Funciones.AlumnosGuardar.EsSabatino, rowadd.NumeroAlumno);
        },
        btnSalirclick: function () {
            sessionStorage.clear();
            window.open("../Administrativo/Index.html", "_parent");
        }
    };

    $('#cmbCarrera').on('change', Funciones.cmbCarrerachange);
    $('#btnAgregar').on('click', Funciones.btnAgregarclick);
    $('#btnNuevoGrupo').on('click', Funciones.btnNuevoGrupoclick);
    $('#btnRegresar').on('click', Funciones.btnRegresarclick);
    $('#tblDocRel').on('click', 'a', Funciones.tblDocRelclicka);
    $('#tblDocRel').on('click', 'button', Funciones.tblDocRelclickbutton);
    $('#tblRelAlumnosA').on('click', 'input', Funciones.tblRelAlumnosAclickinput);
    $('#btnAgregarAl').on('click', Funciones.btnAgregarAlclick);
    $('#tblRelAlumnosE').on('click', 'a', Funciones.tblRelAlumnosEclicka);
    $('#btnSalir').on('click', Funciones.btnSalirclick);

    Funciones.CargarCarreras();
});
