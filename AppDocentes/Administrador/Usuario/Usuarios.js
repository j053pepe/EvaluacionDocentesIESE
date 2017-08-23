$(function init() {
    sessionStorage.setItem("UsuarioIdP", -1);
    var tblUsuarios;
    var form = $('#frmUsuario');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            UserName: {
                required: true,
                minlength: 4
            },
            Nombre: {
                required: true,
                minlength: 3
            },
            Paterno: {
                required: true,
                minlength: 3
            },
            Materno: {
                required: true,
                minlength: 3
            },
            Email: {
                required: true,
                email: true,
                minlength: 5
            },
            Telefono: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            txtPass: {
                required: true,
                minlength: 8
            },
            txtPassR: {
                equalTo: "#txtPass"
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

    $('#btnGuardar').click(function () {
        if (form.valid() == false) { return false; }
        var Datos = {
            userName: $('#txtUserName').val(),
            Nombre: $('#txtNombre').val(),
            Paterno: $('#txtPaterno').val(),
            Materno: $('#txtMaterno').val(),
            Email: $('#txtEmail').val(),
            Telefono: $('#txtTelefono').val(),
            UsuarioId: sessionStorage.getItem("UsuarioIdP"),
            Pass: $('#txtPass').val()
        };

        if (sessionStorage.getItem("UsuarioIdP") > 0) {
            var DatosA = {
                UsuarioId: sessionStorage.getItem("UsuarioIdP"),
                Nombre: $('#txtNombre').val(),
                Paterno: $('#txtPaterno').val(),
                Materno: $('#txtMaterno').val(),
                Email: $('#txtEmail').val(),
                Pass: $('#txtPass').val()
            };
            ActualizaUsuario(DatosA);
        }
        else {
            GuardarUsuario(Datos);
        }

        $("#txtUserName").prop("readonly", false);

    });

    function GuardarUsuario(datos) {
        $('#Load').modal('show');
        $.ajax({
            type: "POST",
            url: "../../Api/Administrador/GuardarAdministrador",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    alertify.alert(data);
                    CargarUsuarios();
                    $('#txtNombre').val("");
                    $('#txtPaterno').val("");
                    $('#txtMaterno').val("");
                    $('#txtUserName').val("");
                    $('#txtEmail').val("");
                    $('#txtPass').val("");
                    $('#txtPassR').val("");
                    $('#Load').modal('hide');
                }
                else {
                    $('#Load').modal('hide');
                    alertify.alert("Error, intente mas tarde");
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function ActualizaUsuario(datos) {
        $('#Load').modal('show');
        $.ajax({
            type: "POST",
            url: "../../Api/Administrador/ActualizaAdministrador",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    alertify.alert(data);
                    CargarUsuarios();
                    $('#txtNombre').val("");
                    $('#txtPaterno').val("");
                    $('#txtMaterno').val("");
                    $('#txtUserName').val("");
                    $('#txtEmail').val("");
                    $('#txtPass').val("");
                    $('#txtPassR').val("");
                    $('#Load').modal('hide');
                }
                else {
                    $('#Load').modal('hide');
                    alertify.alert("Error, intente mas tarde");
                }
            },
            error: function (f) {
                $('#Load').modal('hide');
                alertify.alert("Error, intente mas tarde");
            }
        });
    }

    CargarUsuarios();
    function CargarUsuarios() {
        $('#Load').modal('show');

        $.ajax({
            type: "GET",
            url: "../../Api/Administrador/CargarUsuarios",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    CargarTablaUsuarios(data);
                    $('#Load').modal('hide');
                } else {
                    $('#Load').modal('hide');
                    return false;
                }
            }
        });

    }

    function CargarTablaUsuarios(data) {
        tblUsuarios = $('#tblUsuarios').dataTable({
            "aaData": data,
            "aoColumns": [

                { "mDataProp": "NombreUser" },
                 { "mDataProp": "Nombre" },
                { "mDataProp": "Paterno" },
                { "mDataProp": "Materno" },

                { "mDataProp": "Email" },
                {
                    "mDataProp": "UsuarioId",
                    "mRender": function (data) {
                        return "<u><a href='' id='a1'  style='font-weight: 600;color: #0275d8;' onclick='return false;'>" + "Editar" + " </a></u> ";
                    }
                },
                {
                    "mDataProp": "UsuarioId",
                    "mRender": function (data) {
                        return "<u><a href='' id='a2'  style='font-weight: 600;color: #0275d8;' onclick='return false;'>" + "Eliminar" + " </a></u> ";
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

    $('#tblUsuarios').on("click", "a", function (event) {

        var row = this.parentNode.parentNode;
        var rowadd = tblUsuarios.fnGetData($(this).closest('tr'));


        sessionStorage.setItem("UsuarioIdP", -1);
        if (event.target.id == "a2") {
            $('#Load').modal('show');
            datos = { UsuarioId: rowadd.UsuarioId };
            $.ajax({
                type: "DElETE",
                url: "../../Api/Administrador/BorrarUsuario",
                data: JSON.stringify(datos),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    
                    if (data == "Correcto") {
                        CargarUsuarios();
                        alertify.alert("Se elimino correctamente.");
                    } else {
                        $('#Load').modal('hide');
                        alertify.alert("Error, consulte a su administrador.");
                        return false;
                    }
                }
            });
        }
        if (event.target.id == "a1") {
            //Editar 
            sessionStorage.setItem("UsuarioIdP", rowadd.UsuarioId);
            $("#txtUserName").prop("readonly", true);
            ObtenerUsuarioPorId(rowadd.UsuarioId);
        }

    });

    function ObtenerUsuarioPorId(UsuarioId) {
        datos = {
            UsuarioId: UsuarioId
        };
        $('#Load').modal('show');
        $.ajax({
            type: "POST",
            url: "../../Api/Administrador/GetUsuarioById",
            data: JSON.stringify(datos),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $('#Load').modal('hide');
                if (data != null) {
                    $('#txtNombre').val(data.Nombre);
                    $('#txtPaterno').val(data.Paterno);
                    $('#txtMaterno').val(data.Materno);
                    $('#txtUserName').val(data.NombreUser);
                    $('#txtEmail').val(data.Email);
                    $('#txtPass').val(data.Password);
                    $('#txtPassR').val(data.Password);
                } else {
                    return false;
                }
            }
        });

    }


});