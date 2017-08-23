$(document).ready(function () {
    var tblRegistros;
    var tmpExcel = {};
    var datos = {
        Preguntas: [],
        UsuarioId: ""
    };

    var form = $('#frmPreguntas');
    var error = $('.alert-danger', form);
    var success = $('.alert-success', form);
    form.validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block help-block-error msgError', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        rules: {
            txtArchivo: {
                required: true 
            }
            ,
        }
        ,
        //messages: {
        //    txtArchivo: "Requerido"
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

    $("#btnSubir").click(function () {
        $('#Load').modal('show');
        var IdUsuario = 1;

        $(tmpExcel).each(function () {
            var obj = {
                Descripcion: this.Descripcion,
                CategoriaId: this.CategoriaId,
                TipoCarreraId: this.TipoCarreraId
            };
            datos.Preguntas.push(obj);
        });
            

            datos.UsuarioId = sessionStorage.getItem("Usuario");


        var table =$('#tblPReguntas')[0]; 

        var file = $('#uplPregunta')[0].files[0];
        if (file != null) {
            $("#sMjError").css("display", "none");

            //var obj = tmpExcel;
            datos = JSON.stringify(datos);
            $.ajax({
                type: "POST",
                url: "../../Api/Preguntas/GuardarPreguntas",
                data: datos,//"{tableContents:'" + table.outerHTML + "',IdUsuario:'" + IdUsuario + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (d) {
                    if (d.d == "Correcto") {
                       $('#Load').modal('hide');
                        alertify.alert("Su archivo se subio correctamente");
                        tblRegistros.fnClearTable();
                        CargarPreguntasSist(); 
                        
                         
                    } else {
                        alertify.alert("Error al subir archivo");
                        $('#Load').modal('hide');
                    }
                },
                error: function (f) {
                    alertify.alert("Error de conexion");
                    $('#Load').modal('hide');
                }
            });



        }
        else
        {
            $("#sMjError").css("display", "inline");
             
        }
        //if (form.valid() == false) { alert("Falta Archivo"); return false; }
        //else { alert("Correcto");}
         
    });
     


    $(':file').on('fileselect', function (event, numFiles, label) {
        console.log(numFiles);
        console.log(label);
    });


    document.querySelector('input').addEventListener('change', function (e) {
        alert("cambio");
    }, false);

    $('#uplPregunta').change(function (e) {

        var file = $('#uplPregunta')[0].files[0]; 
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

        
    });
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
        tblRegistros = $('#tblPReguntas').dataTable({
            "aaData": tmpExcel,
            "aoColumns": [
                { "mDataProp": "Descripcion" },
                { "mDataProp": "CategoriaId" },
                { "mDataProp": "TipoCarreraId" }
                
                //{
                //    "mDataProp": "NoPregunta"
                //    //,
                //    //"mRender": function (data) {
                //    //    return "<a href='' class='colorBlack' onclick='return false;'>" + "Asociar Docente" + " </a> ";
                //    //}
                //},
            ],
            "lengthMenu": [[10,20, 50, -1], [10,20, 50, 'Todos']],
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
                "search": "Buscar Pregunta",
            },
            "order": [[1, "desc"]]
        });
    }
 
    CargarPreguntasSist();
    function CargarPreguntasSist() {
        //$('#Load').modal('show');
       
        $.ajax({
            type: "GET",
            url: "../../Api/Preguntas/ObtenerPreguntasSistema",
            data: "",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null) {
                    
                    CargarTablaPreguntas(data);
                    //$('#Load').modal('hide');
                } else {
                    $('#Load').modal('hide');
                    return false;
                }
            }
        });

    }

  

    function CargarTablaPreguntas(data) {
        //$('#Load').modal('show');
        tblDocentes = $('#tblPreguntasSist').dataTable({
            "aaData": data,
            "aoColumns": [
                 
                { "mDataProp": "Descripcion" },
                { "mDataProp": "CategoriaDescripcion" },
                {
                    "mDataProp": "PreguntaId",
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
        //$('#Load').modal('hide');
    }
    //////
    $('#tblPreguntasSist').on("click", "a", function (event) {
        var row = this.parentNode.parentNode;
        var rowadd = tblDocentes.fnGetData($(this).closest('tr'));
        //$('#HMHeader').text("Generar Encuesta " + rowadd.DescripcionPeriodo + " " + rowadd.DescripcionTipoCarrera);
        // sessionStorage.setItem("EncuestaId", rowadd.EncuestaId);
        //alert(event.target.id);
        //alert(rowadd.EncuestaId);
        //window.open("historial-detalles.html", "_parent");

        var PreguntaId = rowadd.PreguntaId;
        datos = { PreguntaId: PreguntaId };
         $.ajax({
                    type: "DELETE",
                    url: "../../Api/Preguntas/BorrarPregunta",
                    data:JSON.stringify( datos),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data == "Correcto") {
                            CargarPreguntasSist();
                            alertify.alert("Se elimino correctamente.");
                        } else {
                            $('#Load').modal('hide');
                            return false;
                        }
                    }
                });   
    });



    //end ready
});
 
 