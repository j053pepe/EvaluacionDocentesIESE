using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DTO;
using AppDocentes.Models;
using AppDocentes.Clases;

namespace AppDocentes.Controllers
{
    public class AdministradorController : ApiController
    {
        private IESEEntities db = new IESEEntities();

        [Route("api/Administrador/Login")]
        [HttpPost]
        public IHttpActionResult Login([FromBody] DTOUsuario user)
        {

            try
            {

                Usuario objUser = db.Usuario.Where(s => s.Nick == user.Nombre).FirstOrDefault();
                if (objUser != null)
                {
                    string llave = Tools.DecryptKey(objUser.Key, objUser.UsuarioId.ToString());
                    user.Password = Tools.EncryptKey(user.Password, llave);
                    string pa1 = Tools.DecryptKey(objUser.Pass, llave);
                    if (objUser.Pass.Equals(user.Password))
                    {
                        return Ok(new DTOUsuario
                        {
                            UsuarioId = objUser.UsuarioId,
                            Nombre = objUser.Nombre + " " + objUser.Paterno + " " + objUser.Materno,
                            NombreUser = objUser.Nick
                        });
                    }
                    else { return null; }
                }
                else
                {
                    return null; // new DTOUsuario { Nombre = "Error Desconocido" }; 
                }
            }
            catch
            {
                return null; // new DTOUsuario { Nombre = L.Message };
            }
        }

        [HttpPost]
        [ActionName("GuardarAdministrador")]
        public string GuardarAdministrador(JObject jdata)
        {
            string userName, Nombre, Paterno, Materno, Email, Pass;

            dynamic json = jdata;
            var a = json.userName;
            userName = a.ToObject<string>();
            var b = json.Nombre;
            Nombre = b.ToObject<string>();
            var c = json.Paterno;
            Paterno = c.ToObject<string>();
            var d = json.Materno;
            Materno = d.ToObject<string>();
            var e = json.Email;
            Email = e.ToObject<string>();
            var f = json.Pass;
            Pass = f.ToObject<string>();

            string Respuesta = "Error";

            try
            {
                Usuario objUser = db.Usuario.Where(s => s.Nick == userName).FirstOrDefault();
                if (objUser == null)
                {
                    db.Usuario.Add(new Usuario
                    {

                    });
                    string Key = Tools.KeyRand();
                    string Password = Tools.EncryptKey(Pass, objUser.Key);
                    db.Usuario.Add(new Usuario
                    {
                        Email = Email,
                        Key = Key,
                        Materno = Materno,
                        Nick = userName,
                        Nombre = Nombre,
                        Pass = Password,
                        Paterno = Paterno,
                    });
                    db.SaveChanges();
                    db.Usuario.Local[0].Key = Tools.EncryptKey(db.Usuario.Local[0].Key, db.Usuario.Local[0].UsuarioId.ToString());
                    db.SaveChanges();
                    if (db.Usuario.Local.FirstOrDefault().UsuarioId > 0)
                    {
                        Respuesta = "El usuario se guardo correctamente.";
                        string NombreCompleto = Nombre.ToUpper() + " " + Paterno + " " + Materno.ToUpper();
                        string Cuerpo = "Te damos la bienvenida a Sistema de Evaluación de Docentes (SED), estos son tus datos de acceso:";
                        string bodyemail = Generahtml("Bienvenido a Sistema de Evaluación de Docentes (SED)", NombreCompleto, Cuerpo, userName, Pass);
                        Email.ProcessResult objResultado = new Email.ProcessResult();
                        if (!Clases.Email.Enviar("noreply@docentesprueba.net", "@Noreply#1800", "Evaluacion de Docentes IESE", Email, ';', "", ';', "Bienvenido a Sistema de Evaluación de Docentes (SED)", bodyemail, "", ';', "mail.negox.com", 587, false, true, objResultado))
                        {
                            Respuesta = "Se guardo correctamente, pero no se pudo enviar el correo de notificación.";
                        }
                    }

                }
                else { Respuesta = "El nombre usuario ya existe en el sistema."; }
            }
            catch { Respuesta = "Error al guardar, contacte a su administrador."; }

            return Respuesta;
        }

        [HttpPost]
        [ActionName("ActualizaAdministrador")]
        public string ActualizaAdministrador([FromBody] DTOUsuario objUsuario)
        {
            string Respuesta = "Error, consulte a su administrador.";

            Usuario dbobjUsuario = db.Usuario.Where(a => a.UsuarioId == objUsuario.UsuarioId).FirstOrDefault();
            objUsuario.Key = objUsuario.Key;
            try
            {
                objUsuario.Key = Tools.KeyRand();
                objUsuario.Password = Tools.EncryptKey(objUsuario.Password, objUsuario.Key);

                Respuesta = "Se actualizo correctamente.";
                dbobjUsuario.Nombre = objUsuario.Nombre;
                dbobjUsuario.Paterno = objUsuario.Paterno;
                dbobjUsuario.Materno = objUsuario.Materno;
                dbobjUsuario.Email = objUsuario.Email;
                dbobjUsuario.Pass = objUsuario.Password;
                dbobjUsuario.Key = objUsuario.Key;
                db.SaveChanges();
                db.Usuario.Local[0].Key = Tools.EncryptKey(db.Usuario.Local[0].Key, db.Usuario.Local[0].UsuarioId.ToString());
                db.SaveChanges();

                string NombreCompleto = dbobjUsuario.Nombre.ToUpper() + " " + dbobjUsuario.Paterno + " " + dbobjUsuario.Materno.ToUpper();
                string Cuerpo = "Te informamos que tus datos han sido actualizados, estos son tus nuevos datos:";
                string bodyemail = Generahtml("Actualización de datos", NombreCompleto, Cuerpo, dbobjUsuario.Nick, objUsuario.Password);
                Email.ProcessResult objResultado = new Email.ProcessResult();
                if (!Clases.Email.Enviar("noreply@docentesprueba.net", "@Noreply#1800", "Evaluacion de Docentes IESE", objUsuario.Email, ';', "", ';', "Actualización de datos", bodyemail, "", ';', "mail.negox.com", 587, false, true, objResultado))
                {
                    Respuesta = "Se actualizo correctamente, pero no se pudo enviar el correo de notificación.";
                }

            }
            catch { }

            return Respuesta;

        }


        [HttpPost]
        [ActionName("GetUsuarioById")]
        public IHttpActionResult GetUsuarioById(JObject jdata)
        {
            dynamic json = jdata;
            var a = json.UsuarioId;
            int UsuarioId = a.ToObject<int>();
            try
            {

                Usuario objUser = db.Usuario.Where(s => s.UsuarioId == UsuarioId).FirstOrDefault();

                if (objUser != null)
                {
                    string llave = Tools.DecryptKey(objUser.Key, objUser.UsuarioId.ToString());
                    string contrase = Tools.DecryptKey(objUser.Pass, llave);

                    return Ok(new DTOUsuario
                    {
                        UsuarioId = objUser.UsuarioId,
                        NombreUser = objUser.Nick,
                        Nombre = objUser.Nombre,
                        Paterno = objUser.Paterno,
                        Materno = objUser.Materno,
                        Email = objUser.Email,
                        Password = contrase,
                        Key = llave

                    });
                }
                else
                {
                    return null;
                }
            }
            catch (Exception e) { string b = e.ToString(); return null; }
        }

        [HttpGet]
        [ActionName("CargarUsuarios")]
        public List<DTO.DTOUsuario> CargarUsuarios()
        {
            try
            {
                return db.Usuario.Select(d => new DTOUsuario
                {
                    UsuarioId = d.UsuarioId,
                    NombreUser = d.Nick,
                    Nombre = d.Nombre,
                    Paterno = d.Paterno,
                    Materno = d.Materno,
                    Email = d.Email

                }).ToList();
            }
            catch { return null; }
        }

        [HttpDelete]
        [ActionName("BorrarUsuario")]
        public string BorrarUsuario(JObject jdata)
        {
            dynamic json = jdata;
            var a = json.UsuarioId;
            string UsuarioId = a.ToObject<string>();
            int UsuarioIdi = int.Parse(UsuarioId);
            string Respuesta = "Error";

            try
            {
                    Usuario objUsuario = db.Usuario.Where(doc => doc.UsuarioId == UsuarioIdi).FirstOrDefault();
                    db.Usuario.Remove(objUsuario);
                    db.SaveChanges();
                    Respuesta = "Correcto";
            }
            catch { }
            return Respuesta;

        }

        private string Generahtml(string Titulo, string NombreCompleto, string Cuerpo, string Usuario, string Pass)
        {

            #region "HTML"
            string bodyemail = "<html lang='en' xmlns='http://www.w3.org/1999/xhtml'>" +
                    "<head>" +
                    "<meta charset='utf-8' />" +
                    "<title>" + Titulo + "</title>" +
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
                                        //"<div class='row'>" +
                                        //    "<div class='col-md-12'>" +
                                        //        "<div class='col-md-3'>" +
                                        //        "</div>" +
                                        //        "<div class='col-md-7 footer-gray portlet light '>" +
                                        //            "<div class='portlet-title '>" +
                                        //                "<div class='caption'>" +
                                        //                    "<h2 class='caption font-green-sharp bold uppercase'>Hola,</h2>" +
                                        //                "</div>" +
                                        //            "</div>" +
                                        //        "</div>" +
                                        //    "</div>" +
                                        "<div class='col-md-12'>" +
                                            "<div class='col-md-3'>" +
                                            "</div>" +
                                            "<div class='col-md-7 footer-gray portlet light portlet-title'>" +
                                                "<h3 class='caption font-blue'> Estimado " + NombreCompleto.ToUpper() + "</h3>" +
                                                "<hr />" +
                                                "<h3 class='caption font-blue'>" + Cuerpo + " </h3>" +
                                                "<hr />" +
                                                "<h3 class='caption font-blue'>Usuario: " + Usuario + "</h3>" +
                                                    "<h3 class='caption font-blue'>Contraseña: " + Pass + " </h3>" +
                                                "<hr />" +
                                                "<h3 class='caption font-blue'>Puedes acceder al sistema <a class='caption font-blue-dark' href='http://www.Docentesprueba.net/Administrativo/index.html'>AQUI</a></h3>" +

                                            "</div>" +
                                        "</div>" +
                                    "</div>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</body>" +
                    "</html>";
            #endregion

            return bodyemail;
        }
    }
}