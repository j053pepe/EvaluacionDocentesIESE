$(function init() {
    var tblRegistros;
    var tmpExcel = {};
    var datos = {
        Alumnos: [],
        UsuarioId: "",
        PeriodoId: "",
        SemestreId: "",
        CarreraId: "",
        EsSabatino: ""
    };
    var form = $('#frmAlumnos');
    var error = $('.alert-danger', form);
    var success = $('.alert-sucess', form);
    form.validate({
        errorElement: 'span',
        errorClass: 'help-block help-block-error msgError',
        focusInvalid: false,
        rules: {
            //txtArchivo: {
            //    required: true
            //},
            ddPeriodo: {
                min: '1',
                required: true
            },
            ddSemestre: {
                min: '1',
                required: true
            },
            ddCarrera: {
                min: '1',
                required: true
            }

        },
        //messages: {
        //    ddPeriodo: "Seleccione periodo",
        //    ddSemestre: "Seleccione semestre",
        //    ddCarrera: "Seleccione carrera"
        //},

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

    //Elemento 
    var excelAlumnos = $('#uplAlumno');
    excelAlumnos = excelAlumnos[0];
    //Carga de Periodos
    CargaPeriodos();
    function CargaPeriodos() {
        $('#Load').modal('show');
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('-1');
        $("#ddPeriodo").append(optionP);
        $.ajax({
            type: "Get",
            url: "../../Api/Periodo",
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
                    CargaSemestres();
                }
            }
        });
    }

    //Carga de Semestres
    function CargaSemestres() {
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('-1');
        $("#ddSemestre").append(optionP);
        $.ajax({
            type: "GET",
            url: "../../Api/Semestre",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    Semestres = data;
                    $(Semestres).each(function () {
                        var option = $(document.createElement('option'));

                        option.text(this.Descripcion);
                        option.val(this.SemestreId);

                        $("#ddSemestre").append(option);
                    });
                    CargaArea();
                }
            }
        });
    }
    
    function CargaArea() {
        var optionP = $(document.createElement('option'));
        optionP.text('--Seleccionar--');
        optionP.val('-1');
        $("#ddCarrera").append(optionP);
        $.ajax({
            type: "GET",
            url: "../../Api/Carrera",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                Carreras = data;
                $(Carreras).each(function () {
                    var option = $(document.createElement('option'));
                    option.text(this.Descripcion);
                    option.val(this.CarreraId);
                    $("#ddCarrera").append(option);
                });
                $('#Load').modal('hide');
            }
        });
    }
    $('#btnSubir').click(function () {
        if (form.valid() == false) { return false; }
        $('#Load').modal('show');
        var EsSabatino = $("#ddSabatino");
        $(tmpExcel).each(function () {
            var obj = {
                AlumnoId: this.AlumnoId,
                Nombre: this.Nombre,
                Materno: this.Materno,
                Paterno: this.Paterno,
                Email: this.Email,
                Telefono: this.Telefono,
            };
            datos.Alumnos.push(obj);
        });
        datos.UsuarioId = sessionStorage.getItem("Usuario");
        datos.SemestreId = $('#ddSemestre').val();
        datos.PeriodoId = $('#ddPeriodo').val();
        datos.CarreraId = $('#ddCarrera').val();
        datos.EsSabatino = EsSabatino[0].checked;
        datos = JSON.stringify(datos);
        $.ajax({
            type: "POST",
            url: "../../Api/Alumno/GuardarListaAlumno",
            data: datos,
            contentType: "application/json",
            dataType: "json",
            success: function (d) {
                if (d != true) {
                    alertify.alert("Alumnos Guardados", function () { location.reload(); });
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                alertify.alert("Error al guardar");
                $('#Load').modal('hide');
            }
        });
    }
        //else {
        //    $("#sMjError").css("display", "inline");
        //}
    );

    $(':file').on('fileselect', function (event, numFiles, label) {
        console.log(numFiles);
        console.log(label);
    });

    //document.querySelector('input').addEventListener('change', function (e) {
    //    alert("cambio");
    //}, false);
    excelAlumnos.onclick = function (e1) {
        $($('#btnSubir')[0]).prop('disabled', true);
        var frm = form[0];
        if ($(frm).valid()) {
            excelAlumnos.onchange = function (e) {
                var frm = form[0];
                if ($(frm).valid()) {
                    var file = $('#uplAlumno')[0].files[0];
                    if (file == null) {
                        $("#sMjError").css("display", "inline");

                    }
                    else {
                        $("#sMjError").css("display", "none");
                    }


                    if (file) {
                        console.log(file.name);
                        $('#txtArchivo').val(file.name);

                        //Area para mostrar el excel en la table
                        e.stopPropagation();
                        e.preventDefault();
                        var files = e.target.files;
                        var i, f;
                        for (i = 0, f = files[i]; i != files.length; ++i) {
                            var reader = new FileReader();
                            var name = f.name;
                            reader.onload = function (e) {
                                var data = e.target.result;

                                /* if binary string, read with type 'binary' */
                                var workbook = XLSX.read(data, { type: 'binary' });

                                /* DO SOMETHING WITH workbook HERE */
                                to_json(workbook);
                            };
                            reader.readAsBinaryString(f);
                        }
                        //fin table

                    }

                }
            };
        } else {
            e1.stopPropagation();
            e1.preventDefault();
            excelAlumnos.onchange = null;      
        }
    };

    function to_json(workbook) {
        workbook.SheetNames.forEach(function (sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                tmpExcel = roa;
            }
        });
        CrearTabla();
    }
    function CrearTabla() {
        tblRegistros = $('#tblAlumnos').dataTable({
            "aaData": tmpExcel,
            "aoColumns": [
                { "mDataProp": "AlumnoId" },
                { "mDataProp": "Nombre" },
                { "mDataProp": "Materno" },
                { "mDataProp": "Paterno" },
                { "mDataProp": "Email" },
                { "mDataProp": "Telefono" }
                ,
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
                    "previous": "<",
                    "next": ">"
                },
                "search": "BuscarAlumno",
            },
            "order": [[1, "desc"]]
        });
        $('#btnSubir').removeAttr('disabled');
    }
});