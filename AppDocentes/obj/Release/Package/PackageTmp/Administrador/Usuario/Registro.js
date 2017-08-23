$(document).ready(function () {
    var form = $('#frmRegistro');
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

    $('#btnEntrar').click(function () {
        if (form.valid() == false) { return false; }
        var Datos = "{userName:'" + $('#txtUserName').val() +
            "',Nombre:'" + $('#txtNombre').val() +
        "',Paterno:'" + $('#txtPaterno').val() +
        "',Materno:'" + $('#txtMaterno').val() +
        "',Email:'" + $('#txtEmail').val() +
        "',Telefono:'" + $('#txtTelefono').val() +
        "',Pass:'" + $('#txtPass').val() + "'}";


        GuardarUsuario(Datos);
    });

    function GuardarUsuario(datos) {
        $.ajax({
            type: "POST",
            url: "../WS/Administrador.asmx/GuardarAdministrador",
            data: datos,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d == true) {
                    alertify.alert("Datos Guardados Correctamente");
                }
                else {
                    alertify.alert("Error, intente mas tarde");
                }
            },
            error: function (f) {
                alertify.alert("Error, intente mas tarde");
            }
        });
    }
    function GuardarDocumentos(Alumnoid, OfertaEducativaId, Anio, Periodo, EsComite, Usuario) {
        var data = new FormData();
        var filBeca = $('#CartaArchivo'); // FileList object

        filBeca = filBeca[0].files[0];
        data.append("DocumentoBeca", filBeca);

        filBeca = $('#ComiteArchivo');
        filBeca = filBeca[0].files[0];
        data.append("DocumentoComite", filBeca);

        data.append("AlumnoId", Alumnoid);
        data.append("OfertaEducativaId", OfertaEducativaId);
        data.append("Anio", Anio);
        data.append("Periodo", Periodo);
        data.append("EsComite", EsComite);
        data.append("UsuarioId", Usuario);

        var request = new XMLHttpRequest();
        request.open("POST", '../WebServices/WS/Beca.asmx/GuardarDocumentos', true);
        request.send(data);

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                var response = JSON.parse(request.responseText);
                if (request.status === 200 && response.status === 'OK') {
                    console.log('successful');
                } else {
                    console.log('failed');
                }
            }
        }
    }
    //function Prueba()
    //{
    //    $.ajax({
    //        type: "POST",
    //        url: "../WS/General.svc/Hola",
    //        data: JSON.stringify({h:"hola"}),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (d) {
    //            var res = d;
    //            console.log(res);
    //            alert(d);
    //        },
    //        error: function (f) {
    //            alert("Error");
    //        }
    //    });
    //}
});