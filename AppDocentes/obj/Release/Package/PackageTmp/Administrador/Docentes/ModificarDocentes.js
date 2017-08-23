$(function init() {
    TraerDocentes();
    var tblDocentes = null;
    var docenteid = 0;
    $('#btnclose').hide();
    var form = $('#frmDocentes');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtNombre: {
                required: true,
                minlength: 3
            },
            txtPaterno: {
                required: true,
                minlength: 3
            },
            txtMaterno: {
                required: true,
                minlength: 3
            }
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

    document.querySelector('input').addEventListener('change', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.target.files;
        var i, f;
        //Poner Nombre y opcion de eliminar 
        var file = $('#fileArchivo');
        var tex = $('#txtNombreArchivo').html();
        if (this.files.length > 0) {
            $('#txtNombreArchivo').text(this.files[0].name);
            file.addClass('fileinput-exists').removeClass('fileinput-new');
            $('#fileArchivo span span').text('Cambiar');
            $('#btnclose').show();
        }
        else {
            $('#txtNombreArchivo').text('');
            file.removeClass('fileinput-exists').addClass('fileinput-new');
            $('#fileArchivo span span').text('Fotografia');
            $('#btnclose').hide();
        }
        for (i = 0, f = files[i]; i != files.length; ++i) {
            var reader = new FileReader();
            var name = f.name;

            reader.onload = function (e) {
                var Base64 = "data:image/png;base64," + btoa(e.target.result);
                $('#imgDocente').attr('src', Base64);
            }

            reader.readAsBinaryString(f);
        }
    }, false);

    $('#fileArchivo a').click(function () {
        var file = $('#fileFoto');
        $('#txtNombreArchivo').text('');
        file.removeClass('fileinput-exists').addClass('fileinput-new');
        File[0] = null;
        $('#fileFoto').val('')

        $('#imgDocente').attr('src', "");

        $('#fileArchivo span span').text('Fotografia');
        $('#btnclose').hide();
    });

    function TraerDocentes() {
        $('#Load').modal('show');
        $.ajax({
            type: "GET",
            url: "../../Api/Docente/TraerDocentes2",
            data: "",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data != null) {
                    CargarTabla(data);
                }
            }
        });
    }
    $('#btnGuardar').click(function () {
        if (!form.valid()) { return false; }
        $('#Load').modal('show');
        var Usuario = sessionStorage.getItem("Usuario");
        var datos = {
            DocenteId: docenteid,
            Nombre: $('#txtNombre').val(),
            Paterno: $('#txtPaterno').val(),
            Materno: $('#txtMaterno').val(),
            UsuarioId: Usuario
        };

        $.ajax({
            type: "POST",
            url: "../../Api/Docente/GuardarDocente",
            data:JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data > 0) {
                    $('#NuevoDocente').modal('hide');
                    GuardarImagen(data);
                    //TraerDocentes();
                } else {
                    $('#Load').modal('hide');
                    alertify.alert("Error al guardar los datos");
                }
            }
        });
    });
    $('#tblDocentes').on("click", "a", function () {
        $('#Load').modal('show');
        $('#tituloModal').text('Modificar Docente');
        var row = this.parentNode.parentNode;
        var rowadd = tblDocentes.fnGetData($(this).closest('tr'));
        CargardatosDocente(rowadd);
    });
    $('#NuevoDocente').on('hidden.bs.modal', function () {
        $('#txtNombre').val("");
        $('#txtPaterno').val("");
        $('#txtMaterno').val("");
        $('#tituloModal').text('Nuevo Docente');
        docenteid = 0;
    });

    function CargardatosDocente(dto) {
        docenteid = dto.DocenteId;
        $('#txtNombre').val(dto.Nombre);
        $('#txtPaterno').val(dto.Paterno);
        $('#txtMaterno').val(dto.Materno);
        $('#imgDocente').attr('src', dto.RutaFoto);
        $('#Load').modal('hide');
        $('#NuevoDocente').modal('show');
    }
    function CargarTabla(lista) {
        tblDocentes = $('#tblDocentes').dataTable({
            "aaData": lista,
            "aoColumns": [
                { "mDataProp": "Nombre" },
                { "mDataProp": "Paterno" },
                { "mDataProp": "Materno" },
                {
                    "mDataProp": "DocenteId",
                    "mRender": function (data) {
                        return "<a href='' class='btn bg-success' onclick='return false;'>" + "Editar Docente" + " </a> ";
                    }
                },
            ],
            "lengthMenu": [[10, 50, 100, -1], [10, 50, 100, 'Todos']],
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

    function GuardarImagen(DocenteId) {
        var data = new FormData();
        var filFoto;

        filFoto = $('#fileFoto');
        filFoto = filFoto[0].files[0];
        if (filFoto === undefined) {
            alertify.alert('Datos Guadados');
            TraerDocentes();
        } else {
            var Ext = filFoto.name;
            Ext = Ext.substring(Ext.length - 4, Ext.length);

            data.append("FotoDocente", filFoto);
            data.append("DocenteId", DocenteId);
            data.append("Extencion", Ext);

            var request = new XMLHttpRequest();
            request.open("POST", '../../Api/Docente/GuardarFoto', true);
            request.send(data);

            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                        alertify.alert('Datos Guadados');
                        TraerDocentes();
                    }
                    else {
                        alertify.alert('Error al guardar datos, intente nuevamente');
                        //$('#Load').modal('hide');
                    }
                }
            }
        }

    }
});