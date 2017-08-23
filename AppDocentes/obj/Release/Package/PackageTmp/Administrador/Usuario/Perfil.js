$(function init() {

    var form = $('#frmPerfil');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {

            txtNombre: {
                required: true
            },
            txtPaterno: {
                required: true
            },
            txtMaterno:{
                        required:true
            },
            txtEmail: {
                required: true
            },
            txtPass: {
                required: true
            },
            txtPassR: {
                required: true
            },
            txtTelefono: {
                required:true
            },
            txtPassR: {
                equalTo: "#txtPass"
            },
        },
        messages: {
            txtNombre:"Ingresa nombre",
            txtPaterno:"Ingresa apellido",
            txtMaterno:"Ingresa apellido",
            txtEmail:"Ingresa correo",
            txtPass: "Ingresa contraseña",
            txtPassR: "La contraseña no coincide",
            txtTelefono: "Ingresa teléfono"
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

    //Obtenemos los datos del usuario
    ObtenemosUsuario();
    function ObtenemosUsuario() {

        var Usuario = sessionStorage.getItem("Usuario");
       
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "../../Api/Administrador/GetUsuarioById",
            data: JSON.stringify({ UsuarioId: Usuario }),
            dataType: "json",
            success: function (data) {
                if (data != null) {

                    $('#txtUserName').val(data.NombreUser);
                    $('#txtNombre').val(data.Nombre);
                    $('#txtPaterno').val(data.Paterno);
                    $('#txtMaterno').val(data.Materno);
                    $('#txtEmail').val(data.Email);
                    $('#txtPass').val(data.Password);
                    $('#txtPassR').val(data.Password);
                }
            },
            error: function (f) {
                alertify.alert("Error, intente mas tarde");
            }
        });
    }


    $('#btnGuardar').click(function () {
        if (form.valid() == false) { return false; }
        var Usuario = sessionStorage.getItem("Usuario");
        var datos = {
            UsuarioId: Usuario,
            Nombre: $('#txtNombre').val(),
            Paterno: $('#txtPaterno').val(),
            Materno: $('#txtMaterno').val(),
            Email: $('#txtEmail').val(),
            Pass: $('#txtPass').val()
        };

        $.ajax({
            type: "POST",
            url: "../../Api/Administrador/ActualizaAdministrador",
            data: JSON.stringify({
                UsuarioId: Usuario,
                Nombre: $('#txtNombre').val(),
                Paterno: $('#txtPaterno').val(),
                Materno: $('#txtMaterno').val(),
                Email: $('#txtEmail').val(),
                Pass: $('#txtPass').val()
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data !=null) {
                    alertify.alert(data);
                }
                else {
                    alertify.alert("Error, intente mas tarde");
                }
            },
            error: function (f) {
                alertify.alert("Error, intente mas tarde");
            }
        });


    });



    //end ready
});