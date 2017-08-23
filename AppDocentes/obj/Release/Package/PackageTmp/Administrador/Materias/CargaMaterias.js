$(document).ready(function () {
    var tblRegistros;
    var datos = {
        Materias: [],
        UsuarioId: ""
    };
    var tmpExcel = {};
    var Usuario = sessionStorage.getItem("UsuarioId");
    $('#btnclose').hide();

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
            $('#fileArchivo span span').text('Selecciona tu archivo de Excel a Subir');
            $('#btnclose').hide();
        }
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
    }, false);
    $('#btnSubirMaterias').click(function () {
        MandarMaterias();
    });
    $('#fileArchivo a').click(function () {
        var file = $('#FileCarta');
        $('#txtNombreArchivo').text('');
        file.removeClass('fileinput-exists').addClass('fileinput-new');
        File[0] = null;
        $('#fileArchivo span span').text('Selecciona tu archivo de Excel a Subir');
        if (tblRegistros != null) { tblRegistros.fnClearTable(); tmpExcel = null; }
        $('#btnclose').hide();
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
    function MandarMaterias() {
        $('#Load').modal('show');

        $(tmpExcel).each(function () {
            var obj = {
                MateriaId: this.Clave,
                Descripcion: this.Descripcion
            };
            datos.Materias.push(obj);
        });
        datos.UsuarioId = sessionStorage.getItem("Usuario");
        datos = JSON.stringify(datos);
        $.ajax({ 
            type: "Put",
            url: "../../Api/Materias/GuardarTodas",
            data: datos,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.length==0) {
                    alertify.alert("Materias Guardadas");
                    $('#Load').modal('hide');
                    location.reload();
                } else
                {
                    alertify.alert("Error Al Guardar </br> Las siguientes materias no se guardaron.");
                    $('#Load').modal('hide');
                    tmpExcel = data;
                    tblRegistros.fnClearTable();
                    CrearTabla2();
                }
            },
            error: function (f) {
                alertify.alert("Error Al Guardar");
                $('#Load').modal('hide');
            }
        });
    }
    function CrearTabla() {
        tblRegistros = $('#tblMaterias').dataTable({
            "aaData": tmpExcel,
            "aoColumns": [
                { "mDataProp": "Clave" },
                { "mDataProp": "Descripcion" },
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
                "search": "Buscar Materia ",
            },
            "order": [[1, "desc"]]
        });
    }
    function CrearTabla2() {
        tblRegistros = $('#tblMaterias').dataTable({
            "aaData": tmpExcel,
            "aoColumns": [
                { "mDataProp": "MateriaId" },
                { "mDataProp": "Descripcion" },
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
                "search": "Buscar Materia ",
            },
            "order": [[1, "desc"]]
        });
    }
});