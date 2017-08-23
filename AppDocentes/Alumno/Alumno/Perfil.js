$(function init() {
    var form = $('#frmRegistro');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    var objAlumno = { Alumno: "" };

    TraerAlumno();

    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtEmail: {
                required: true,
                email: true,
                minlength: 5
            },
            txtTelefono: {
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
        submitHandler: function (form) {
            success.show();
            error.hide();
        }
    });

    function TraerAlumno() {
        $('#Load').modal('show');
        var alumno = sessionStorage.getItem("NoControl");
        $.ajax({
            type: "GET",
            url: "../../Api/Alumno/ObtenerAlumno",
            data: { AlumnoId: alumno },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    objAlumno.Alumno = data;
                    $('#txtUserName').val(data.AlumnoId);
                    $('#txtNombre').val(data.Nombre);
                    $('#txtPaterno').val(data.Paterno);
                    $('#txtMaterno').val(data.Materno);
                    $('#txtTelefono').val(data.Telefono);
                    $('#txtEmail').val(data.Email);
                    $('#Load').modal('hide');
                }
                else {
                    alertify.alert("Error, intente mas tarde");
                    $('#Load').modal('hide');
                }
            },
            error: function (f) {
                alertify.alert("Error, intente mas tarde");
                $('#Load').modal('hide');
            }
        });
    }
    $('#btnEntrar').click(function () {
        if (form.valid()) {
            objAlumno.Alumno.Telefono = $('#txtTelefono').val();
            objAlumno.Alumno.Pass = $('#txtPass').val();
            objAlumno.Alumno.Email = $('#txtEmail').val();

            GuardarAlumno();
        }
    });

    function GuardarAlumno() {
        $('#Load').modal('show');
       var objAlumno1 = JSON.stringify(objAlumno);
        $.ajax({
            type: "Put",
            url: "../../Api/Alumno/ActualizarPerfil",
            data: objAlumno1,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data == true) {
                    $('#Load').modal('hide');
                    alertify.alert("Datos Guardados Correctamente");
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
});