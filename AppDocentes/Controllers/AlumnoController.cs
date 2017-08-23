using AppDocentes.Clases;
using DTO;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using AppDocentes.Models;

namespace Services.Controllers
{
    public class AlumnoController : ApiController
    {
        private IESEEntities db = new IESEEntities();
        #region Administrativo
        [HttpPost]
        [ActionName("Enviar")]
        public string[] Enviar(string Nombre)
        {
            string a = "20081067", b = "2023176";
            string[] r = { a.Substring(4), b.Substring(4) };
            return r;
        }

        
        [HttpPost]
        [ActionName("GuardarListaAlumno")]
        public bool GuardarLista(JObject jsonData)
        {
            dynamic json = jsonData;
            var a2 = json.Alumnos;
            var b = json.UsuarioId;
            var c = json.PeriodoId;
            var d = json.SemestreId;
            var e = json.CarreraId;
            var f = json.EsSabatino;

            List<DTOAlumno> Alumnos = new List<DTOAlumno>();
            foreach(JObject a1 in a2)
            {
                var alm = a1.ToObject<DTOAlumno>();
                Alumnos.Add(alm);
            }
            string UsuarioId = b.ToObject<string>();
            string PeriodoId = c.ToObject<string>();
            string SemestreId = d.ToObject<string>();
            string CarreraId = e.ToObject<string>();
            string EsSabatino = f.ToObject<string>();

            return guarda();
            
            bool guarda ()
                {
                try
                {

                    Alumnos.ForEach(a =>
                    {
                        a.Pass = "";
                        a.key = Tools.KeyRand();
                        a.Pass = a.AlumnoId;
                        string bodyemail = "";
                        #region "HTML"
                        bodyemail = "<html lang='en' xmlns='http://www.w3.org/1999/xhtml'>" +
                                "<head>" +
                                "<meta charset='utf-8' />" +
                                "<title>Bienvenida Alumnos</title>" +
                                "<meta http-equiv='X-UA-Compatible' content='IE=edge' />" +
                                "<meta content='width=device-width, initial-scale=1.0' name='viewport' />" +
                                "<meta http-equiv='Content-type' content='text/html; charset=utf-8' />" +
                                "<meta content='' name='description' />" +
                                "<meta content='' name='author' />" +
                               "<style>" +
                                    "body {" +
                                        "color: #333333;" +
                                        "font-family: 'Open Sans', sans-serif;" +
                                        "padding: 0px !important;" +
                                        "margin: 0px !important;" +
                                        "font-size: 13px;" +
                                        "direction: ltr;" +
                                    "}" +
                                    "body {" +
                                        "font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;" +
                                        "font-size: 14px;" +
                                        "line-height: 1.42857143;" +
                                        "color: #333;" +
                                        "background-color: #fff;" +
                                    "}" +
                                    "Inherited from html html {" +
                                        "font-size: 10px;" +
                                        "-webkit-tap-highlight-color: rgba(0,0,0,0);" +
                                    "}" +
                                    "html {" +
                                        "font-family: sans-serif;" +
                                        "-webkit-text-size-adjust: 100%;" +
                                        "-ms-text-size-adjust: 100%;" +
                                    "}" +
                                    "div, input, select, textarea, span, img, table, label, td, th, p, a, button, ul, code, pre, li {" +
                                        "-webkit-border-radius: 0 !important;" +
                                        "-moz-border-radius: 0 !important;" +
                                        "border-radius: 0 !important;" +
                                    "}" +
                                    "* {" +
                                        "-webkit-box-sizing: border-box;" +
                                        "-moz-box-sizing: border-box;" +
                                        "box-sizing: border-box;" +
                                    "}" +
                                    "@media (min-width: 1200px) {" +
                                        ".container {" +
                                            "width: 1170px;" +
                                        "}" +
                                    "}" +
                                    "@media (min-width: 992px) {" +
                                        ".container {" +
                                            "width: 970px;" +
                                        "}" +
                                    "}" +
                                    "@media (min-width: 768px) {" +
                                        ".container {" +
                                            "width: 750px;" +
                                        "}" +
                                    "}" +
                                    ".container {" +
                                        "padding-right: 15px;" +
                                        "padding-left: 15px;" +
                                        "margin-right: auto;" +
                                        "margin-left: auto;" +
                                    "}" +
                                            ".row {" +
                                                "margin-right: -15px;" +
                                                "margin-left: -15px;" +
                                            "}" +
                                            ".col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9 {" +
                                        "float: left;" +
                                    "}" +
                                    ".col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 {" +
                                        "position: relative;" +
                                        "min-height: 1px;" +
                                        "padding-right: 15px;" +
                                        "padding-left: 15px;" +
                                    "}" +
                                    ".portlet.light {" +
                                        "padding: 12px 20px 15px 20px;" +
                                        "background-color: #fff;" +
                                    "}" +
                                    ".portlet {" +
                                        "margin-top: 0px;" +
                                        "margin-bottom: 25px;" +
                                        "padding: 0px;" +
                                        "-webkit-border-radius: 4px;" +
                                        "-moz-border-radius: 4px;" +
                                        "-ms-border-radius: 4px;" +
                                        "-o-border-radius: 4px;" +
                                        "border-radius: 4px;" +
                                    "}" +
                                    ".portlet.light > .portlet-title {" +
                                        "padding: 0;" +
                                        "min-height: 48px;" +
                                    "}" +
                                    ".portlet > .portlet-title {" +
                                        "border-bottom: 1px solid #eee;" +
                                        "padding: 0;" +
                                        "margin-bottom: 10px;" +
                                        "min-height: 41px;" +
                                        "-webkit-border-radius: 4px 4px 0 0;" +
                                        "-moz-border-radius: 4px 4px 0 0;" +
                                        "-ms-border-radius: 4px 4px 0 0;" +
                                        "-o-border-radius: 4px 4px 0 0;" +
                                        "border-radius: 4px 4px 0 0;" +
                                    "}" +
                                    ".portlet.light > .portlet-title > .caption {" +
                                        "color: #666;" +
                                        "padding: 10px 0;" +
                                    "}" +
                                    ".portlet > .portlet-title > .caption {" +
                                        "float: left;" +
                                        "display: inline-block;" +
                                        "font-size: 18px;" +
                                        "line-height: 18px;" +
                                        "padding: 10px 0;" +
                                    "}" +
                                    ".uppercase {" +
                                        "text-transform: uppercase !important;" +
                                    "}" +
                                    ".bold {" +
                                        "font-weight: 700 !important;" +
                                    "}" +
                                    "h2 {" +
                                        "font-size: 27px;" +
                                    "}" +
                                    "h3 {" +
                                        "font-size: 23px;" +
                                    "}" +
                                    "h4 {" +
                                        "font-size: 17px;" +
                                    "}" +
                                    ".h4, h4 {" +
                                        "font-size: 18px;" +
                                    "}" +
                                    "h1, h2, h3, h4, h5, h6 {" +
                                        "font-family: 'Open Sans', sans-serif;" +
                                        "font-weight: 300;" +
                                    "}" +
                                    ".h2, h2 {" +
                                        "font-size: 30px;" +
                                    "}" +
                                    ".h1, .h2, .h3, h1, h2, h3 {" +
                                        "margin-top: 20px;" +
                                        "margin-bottom: 10px;" +
                                    "}" +
                                    ".h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {" +
                                        "font-family: inherit;" +
                                        "font-weight: 500;" +
                                        "line-height: 1.1;" +
                                        "color: inherit;" +
                                    "}" +
                                    "* {" +
                                        "-webkit-box-sizing: border-box;" +
                                        "-moz-box-sizing: border-box;" +
                                        "box-sizing: border-box;" +
                                    "}" +
                                    "user agent stylesheeth2 {" +
                                        "display: block;" +
                                        "font-size: 1.5em;" +
                                        "-webkit-margin-before: 0.83em;" +
                                        "-webkit-margin-after: 0.83em;" +
                                        "-webkit-margin-start: 0px;" +
                                        "-webkit-margin-end: 0px;" +
                                        "font-weight: bold;" +
                                    "}" +
                                    ".table {" +
                                        "width: 100%;" +
                                        "max-width: 100%;" +
                                        "margin-bottom: 20px;" +
                                    "}" +
                                    ".font-green-sharp {" +
                                        "color: #4DB3A2 !important;" +
                                    "}" +
                                    ".uppercase {" +
                                        "text-transform: uppercase !important;" +
                                    "}" +
                                    ".bold {" +
                                        "font-weight: 700 !important;" +
                                    "}" +
                                    ".font-blue {" +
                                        "color: #3598dc !important;" +
                                    "}" +
                                    "hr {" +
                                        "margin: 20px 0;" +
                                        "border: 0;" +
                                        "border-top: 1px solid #eee;" +
                                        "border-bottom: 0;" +
                                    "}" +
                                    "hr {" +
                                        "margin-top: 20px;" +
                                        "margin-bottom: 20px;" +
                                        "border: 0;" +
                                        "border-top: 1px solid #eee;" +
                                    "}" +
                                    "hr {" +
                                        "height: 0;" +
                                        "-webkit-box-sizing: content-box;" +
                                        "-moz-box-sizing: content-box;" +
                                        "box-sizing: content-box;" +
                                    "}" +
                                    "* {" +
                                        "-webkit-box-sizing: border-box;" +
                                        "-moz-box-sizing: border-box;" +
                                        "box-sizing: border-box;" +
                                    "}" +
                                    "user agent stylesheethr {" +
                                        "display: block;" +
                                        "-webkit-margin-before: 0.5em;" +
                                        "-webkit-margin-after: 0.5em;" +
                                        "-webkit-margin-start: auto;" +
                                        "-webkit-margin-end: auto;" +
                                        "border-style: inset;" +
                                        "border-width: 1px;" +
                                    "}" +
                                "</style>" +
                                "</head>" +
                                "<body>" +
                                    "<div class='page-head'>" +
                                        "<div class='container'>" +
                                            "<div class='table'>" +
                                                "<div class='row'>" +
                                                    "<div class='col-md-12'>" +
                                                        "<div class='col-md-3'>" +
                                                        "</div>" +
                                                        "<div class='col-md-7 footer-gray portlet light '>" +
                                                            "<div class='portlet-title '>" +
                                                                "<div class='caption'>" +
                                                                    "<h2 class='caption font-green-sharp bold uppercase'>Bienvenido</h2>" +
                                                                "</div>" +
                                                            "</div>" +
                                                        "</div>" +
                                                    "</div>" +
                                                    "<div class='col-md-12'>" +
                                                        "<div class='col-md-3'>" +
                                                        "</div>" +
                                                        "<div class='col-md-7 footer-gray portlet light portlet-title'>" +
                                                            "<h3 class='caption font-blue'>" + a.Nombre + " " + a.Paterno + " " + a.Materno + "</h3>" +
                                                            "<hr />" +
                                                            "<h3 class='caption font-blue'>Los siguientes datos son tus credenciales para poder acceder al portal de la universidad</h3>" +
                                                            "<hr />" +
                                                            "<h3 class='caption font-blue'>Usuario</h3>" +
                                                            "<h4 class='caption font-blue-dark'>" + a.AlumnoId.ToString() + "</h4>" +
                                                                "<h3 class='caption font-blue'>Contraseña</h3>" +
                                                            "<h4 class='caption font-blue-dark'>" + a.Pass + "</h4>" +
                                                            "<hr />" +
                                                            "<h3 class='caption font-blue'>Puedes acceder a el desde el siguiente enlace.</h3>" +
                                                            "<a class='caption font-blue-dark' href='http://www.Docentesprueba.net/Alumno/index.html'>IESE</a>" +
                                                        "</div>" +
                                                    "</div>" +
                                                "</div>" +
                                            "</div>" +
                                        "</div>" +
                                    "</div>" +
                                "</body>" +
                                "</html>";
                        #endregion
                        Email.ProcessResult objResultado = new Email.ProcessResult();
                        Email.Enviar("noreply@docentesprueba.net", "@Noreply#1800", "Evaluacion de Docentes IESE", a.Email, ';', "", ';', "Bienvenido a Evaluacion de Docentes IESE", bodyemail, "", ';', "mail.negox.com", 587, false, true, objResultado);
                        a.Pass = Tools.EncryptKey(a.Pass, a.key);
                        a.key = Tools.EncryptKey(a.key, a.AlumnoId);
                        db.Alumno.Add(new Alumno
                        {
                            AlumnoId = a.AlumnoId,
                            Nombre = a.Nombre,
                            Paterno = a.Paterno,
                            Materno = a.Materno,
                            Email = a.Email,
                            Telefono = a.Telefono,
                            UsuarioId = int.Parse( UsuarioId),
                            EsSabatino =bool.Parse(EsSabatino),
                            Pass = a.Pass,
                            Key = a.key,
                            HistorialAlumno = new List<HistorialAlumno>
                            {
                                new HistorialAlumno
                                {
                                    AlumnoId = a.AlumnoId,
                                    PeriodoId =int.Parse(PeriodoId),
                                    SemestreId =int.Parse(SemestreId),
                                    CarreraId =int.Parse(CarreraId),
                                    Fecha = DateTime.Now
                                }
                            }
                        });
                    });
                    db.SaveChanges();
                   return true;
                }
                catch
                {
                   return false;
                }
            }
        }

        [HttpPost]
        [ActionName("GuardarAlumno")]
        public bool GuardarAlumno(DTOAlumno alumno)
        {
            try
            {
                alumno.key = Tools.KeyRand();
                //si no trae nada en pass genera una aleatoria 
                alumno.Pass = alumno.Pass.Length == 0 ? Tools.KeyRand() : alumno.Pass;
                alumno.Pass = Tools.EncryptKey(alumno.Pass, alumno.key);
                alumno.key = Tools.EncryptKey(alumno.key, alumno.AlumnoId);

                db.Alumno.Add(new Alumno
                {
                    AlumnoId = alumno.AlumnoId,
                    Materno = alumno.Materno,
                    Nombre = alumno.Nombre,
                    Paterno = alumno.Paterno,
                    Email = alumno.Email,
                    Telefono = alumno.Telefono,
                    Pass = alumno.Pass,
                    Key = alumno.key
                });

                db.SaveChanges();
                return true;
            }
            catch { return false; }
        }       
        
        #endregion
        #region Alumno
        [HttpPost]
        [ActionName("LoginAlumno")]
        public DTOAlumno Login(JObject jsonData)
        {
            dynamic json = jsonData;
            var us = json.Usuario;
            var pa = json.Pass;

            string Usuario = us.ToObject<string>();
            string Pass = pa.ToObject<string>();
            try
            {
                Alumno objAlumn = db.Alumno.Where(s => s.AlumnoId == Usuario).FirstOrDefault();

                if (objAlumn == null) { return null; }//Alumno No Existe
                objAlumn.Key = Tools.DecryptKey(objAlumn.Key, Usuario);
                Pass = Tools.EncryptKey(Pass, objAlumn.Key);
                string n = Tools.DecryptKey(objAlumn.Pass, objAlumn.Key);
                if (!objAlumn.Pass.Equals(Pass)) { return null; }

                return new DTOAlumno
                {
                    AlumnoId = objAlumn.AlumnoId,
                    Materno = objAlumn.Materno,
                    Nombre = objAlumn.Nombre,
                    Paterno = objAlumn.Paterno
                };
            }
            catch
            { return null; }
        }

        [HttpGet]
        [ActionName("ObtenerAlumno")]
        public DTOAlumno ObtenerAlumno(string AlumnoId)
        {
            try
            {
                return db.Alumno.Where(a => a.AlumnoId == AlumnoId)
                              .Select(a => new
                              DTOAlumno
                              {
                                  AlumnoId = a.AlumnoId,
                                  Email = a.Email,
                                  Materno = a.Materno,
                                  Nombre = a.Nombre,
                                  Telefono = a.Telefono,
                                  Paterno = a.Paterno
                              }).FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }

        [HttpPut]
        [ActionName("GuardarTest")]
        public bool GuardarTest(JObject jdata)
        {
            dynamic json = jdata;
            var a = json.TestAlumno;
            TestAlumno TestAlumno = a.ToObject<TestAlumno>();
            try
            {
                db.ComentarioDocente.Add(new ComentarioDocente
                {
                    ConfiguracionEncuestaId = TestAlumno.Preguntas.FirstOrDefault().ConfiguracionEncuestaId,
                    CarreraId = int.Parse(TestAlumno.Carrera),
                    Comentario = TestAlumno.Comentario,
                    DocenteId = int.Parse(TestAlumno.Docente),
                    EsSabatino = bool.Parse(TestAlumno.Sabatino),
                    MateriaId = TestAlumno.MateriaId,
                    FechaAplicacion = DateTime.Now,
                    PeriodoId = int.Parse(TestAlumno.Periodo)
                });
                TestAlumno.Preguntas.ForEach(pregunta => {
                    db.PreguntaDocente.Add(new PreguntaDocente
                    {
                        ConfiguracionEncuestaId = pregunta.ConfiguracionEncuestaId,
                        CarreraId = int.Parse(TestAlumno.Carrera),
                        MateriaId = TestAlumno.MateriaId,
                        DocenteId = int.Parse(TestAlumno.Docente),
                        EsSabatino = bool.Parse(TestAlumno.Sabatino),
                        FechaAplicacion = DateTime.Now,
                        PeriodoId = int.Parse(TestAlumno.Periodo),
                        PreguntaId = int.Parse(pregunta.PreguntaId),
                        OpcionPreguntaId = int.Parse(pregunta.Respuesta)
                    });
                });

                int carrera = int.Parse(TestAlumno.Carrera),
                    docente = int.Parse(TestAlumno.Docente),
                    periodo = int.Parse(TestAlumno.Periodo);
                AlumnoMateria objAlumnoE = db.AlumnoMateria.Where(k =>
                                                          k.AlumnoId == TestAlumno.AlumnoId
                                                          && k.CarreraId == carrera
                                                          && k.DocenteId == docente
                                                          && k.PeriodoId == periodo
                                                          && k.MateriaId == TestAlumno.MateriaId).FirstOrDefault();
                db.AlumnoMateria.Remove(objAlumnoE);

                if (db.AlumnoPrueba.Where(k =>
                             k.AlumnoId == TestAlumno.AlumnoId
                             && k.CarreraId == carrera
                             && k.PeriodoId == periodo).
                             ToList().Count == 0)
                {
                    db.AlumnoPrueba.Add(new AlumnoPrueba
                    {
                        AlumnoId = TestAlumno.AlumnoId,
                        CarreraId = int.Parse(TestAlumno.Carrera),
                        Estatus = true,
                        FechaAplicacion = DateTime.Now,
                        PeriodoId = int.Parse(TestAlumno.Periodo)
                    });
                }
                db.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
        [HttpPut]
        [ActionName("GuardarTestServicios")]
        public bool GuardarTestServicios(JObject jdata)
        {
            dynamic json = jdata;
            var a = json.TestAlumno;
            TestAlumno testAlumno = a.ToObject<TestAlumno>();

            try
            {

                int CarreraId = int.Parse(testAlumno.Carrera), PeriodoId = int.Parse(testAlumno.Periodo), CategoriaId = testAlumno.ServicioId;
                bool sabatino = bool.Parse(testAlumno.Sabatino);
                testAlumno.Preguntas.ForEach(Preg =>
                {
                    int PregId = int.Parse(Preg.PreguntaId), OpcionId = int.Parse(Preg.Respuesta);
                    db.PreguntaServicios.Add(new PreguntaServicios
                    {
                        ConfiguracionEncuestaId = Preg.ConfiguracionEncuestaId,
                        CarreraId = CarreraId,
                        CategoriaId = CategoriaId,
                        FechaAplicacion = DateTime.Now,
                        OpcionPreguntaId = OpcionId,
                        PeriodoId = PeriodoId,
                        PreguntaId = PregId,
                        EsSabatino = sabatino
                    });
                });

                db.ComentarioServicios.Add(
                    testAlumno.Comentario.Length > 0 ?
                    new ComentarioServicios
                    {
                        ConfiguracionEncuestaId = testAlumno.Preguntas.FirstOrDefault().ConfiguracionEncuestaId,
                        CarreraId = CarreraId,
                        Comentario = testAlumno.Comentario,
                        FechaAplicacion = DateTime.Now,
                        PeriodoId = PeriodoId,
                        CategoriaId = CategoriaId,
                        EsSabatino = sabatino
                    } : null);
                var alumnodb = db.AlumnoPruebaServicio.Where(o => o.AlumnoId == testAlumno.AlumnoId
                                                                 && o.PeriodoId == PeriodoId
                                                                 && o.ServicioId == testAlumno.ServicioId)
                                                                .ToList();

                db.AlumnoPruebaServicio.Add(
                    alumnodb.Count > 0 ? null :
                    new AlumnoPruebaServicio
                    {
                        AlumnoId = testAlumno.AlumnoId,
                        CarreraId = CarreraId,
                        PeriodoId = PeriodoId,
                        ServicioId = testAlumno.ServicioId,
                        FechaAplicacion = DateTime.Now
                    });

                db.SaveChanges();
                return true;
                //db.ComentarioServicios;
                //db.AlumnoPruebaServicio;

            }
            catch { return false; }
        }
        [HttpPut]
        [ActionName("ActualizarPerfil")]
        public bool ActualizarPerfil(JObject jdata)
        {
            dynamic json = jdata;
            var a2 = json.Alumno;
            DTOAlumno alumno = a2.ToObject<DTOAlumno>();

            try
            {
                var objAlumno = db.Alumno.Where(a => a.AlumnoId == alumno.AlumnoId)
                              .Select(a => a).FirstOrDefault();

                objAlumno.Email = alumno.Email;
                objAlumno.Telefono = alumno.Telefono;

                objAlumno.Key = Tools.KeyRand();
                objAlumno.Pass = Tools.EncryptKey(alumno.Pass, objAlumno.Key);
                objAlumno.Key = Tools.EncryptKey(objAlumno.Key, objAlumno.AlumnoId);

                db.SaveChanges();
                Email.ProcessResult objResultado = new Email.ProcessResult();

                string Mensaje = "Se actualizaron tus datos correctamente.";

                if (Email.Enviar("noreply@docentesprueba.net", "@Noreply#1800", "Evaluacion de Docentes IESE", objAlumno.Email, ';', "", ';', "Actualizacion de datos", Mensaje, "", ';', "mail.negox.com", 587, false, false, objResultado))
                {
                    return true;
                }
                else { return false; }
            }
            catch
            {
                return false;
            }
        }
        #endregion
    }
}