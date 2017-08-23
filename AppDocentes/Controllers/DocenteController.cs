using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Remoting.Contexts;
using System.Web;
using System.Web.Http;
using System.Text;
using System.Web.Services;
using Newtonsoft.Json.Linq;
using AppDocentes.Models;
using DTO;
using AppDocentes.Clases;

namespace Services.Controllers
{
    public class DocenteController : ApiController
    {
        private IESEEntities db = new IESEEntities();

        #region Administrador
        [HttpGet]
        [ActionName("TraerDocentes")]
        public List<DTO.DTODocente> TraerDocentes()
        {
            return
                    db.Docente.Select(d => new DTODocente
                    {
                        DocenteId = d.DocenteId,
                        Nombre = d.Nombre + " " + d.Paterno + " " + d.Materno
                    }).ToList();
        }
        [HttpGet]
        [ActionName("TraerDocentes2")]
        public List<DTO.DTODocente> TraerDocentes2()
        {
            List<DTODocente> lstDocentes =
                    db.Docente.Select(d => new DTODocente
                    {
                        DocenteId = d.DocenteId,
                        Nombre = d.Nombre,
                        Paterno = d.Paterno,
                        Materno = d.Materno,
                        RutaFoto = d.urlImagen,
                    }).ToList();

            return lstDocentes;
        }
        [HttpPost]
        [ActionName("GuardarDocente")]
        public int GuardarDocente(JObject jdata)
        {
            dynamic json = jdata;

            var a = json.DocenteId;
            string DocenteId=a.ToObject<string>();

            var b = json.Nombre;
            string Nombre = b.ToObject<string>();

            var c = json.Paterno;
            string Paterno = c.ToObject<string>();

            var d = json.Materno;
            string Materno = d.ToObject<string>();

            var f = json.UsuarioId;
            string UsuarioId = f.ToObject<string>();

            int doce = int.Parse(DocenteId);
            if (doce > 0)
            {
                try
                {
                    Docente objUpdate = db.Docente.Where(d2 => d2.DocenteId == doce).FirstOrDefault();
                    objUpdate.Nombre = Nombre;
                    objUpdate.Paterno = Paterno;
                    objUpdate.Materno = Materno;
                    objUpdate.UsuarioId = int.Parse(UsuarioId);

                    db.SaveChanges();
                    return objUpdate.DocenteId;
                }
                catch { return 0; }
            }
            else
            {
                try
                {
                    db.Docente.Add(new Docente
                    {
                        Nombre = Nombre,
                        Paterno = Paterno,
                        Materno = Materno,
                        UsuarioId = int.Parse(UsuarioId)
                    });
                    db.SaveChanges();
                    return db.Docente.Local.FirstOrDefault().DocenteId;
                }
                catch { return 0; }
            }
        }
        [HttpPost]
        [ActionName("GuardarDocentes")]
        public List<DTO.DTODocente> GuardarDocentes(JObject jData)
        {
            dynamic json = jData;

            var a = json.Docentes;
            List<DTO.DTODocente> lstDocentes = new List<DTO.DTODocente>();
            foreach(JObject a1 in a)
            {
                var doc1 = a1.ToObject<DTO.DTODocente>();
                lstDocentes.Add(doc1);
            }
            var b = json.UsuarioId;
            string UsuarioId = b.ToObject<string>();

            List<DTODocente> lst2 = new List<DTODocente>();
            try
            {
                List<Docente> lstGuardar = new List<Docente>();
                lstDocentes.ForEach(o =>
                {
                    if (db.Docente.Where(l => l.Nombre == o.Nombre
                                        && l.Paterno == o.Paterno
                                        && l.Materno == o.Materno).ToList().Count == 0)
                    {
                        db.Docente.Add(new Docente
                        {
                            Nombre = o.Nombre,
                            Paterno = o.Paterno,
                            Materno = o.Materno,
                            UsuarioId = int.Parse(UsuarioId)
                        });
                    }
                    else { lst2.Add(o); }
                });

                db.SaveChanges();
                return lst2;
            }
            catch
            {
                return lst2;
            }
        }
        [HttpGet]
        public string PruebaGuardado()
        {
            try
            {
                string archivo = "Hola Mundo, este es un mensaje de prueba";
                byte[] buffer = Encoding.ASCII.GetBytes(archivo);

                string filename = HttpContext.Current.Server.MapPath("../Administrador/ImgDocentes/Ejemplo.txt");

                using (StreamWriter _testData = new StreamWriter(filename, true))
                {
                    _testData.WriteLine(archivo); // Write the file.
                }

                return "Archivo Creado";
            }
            catch (Exception a) { return a.Message; }
        }

        [HttpPost]
        [ActionName("GuardarFoto")]
        public void GuardarFoto()
        {
            HttpFileCollection httpFileCollection = HttpContext.Current.Request.Files;
            System.Collections.Specialized.NameValueCollection Contenido = HttpContext.Current.Request.Form;

            DTO.DTODocente objDocente;
            try
            {
                int DocenteId = int.Parse(Contenido["DocenteId"]);
                string ext = Contenido["Extencion"];

                objDocente = db.Docente.Where(I => I.DocenteId == DocenteId)
                    .Select(d => new DTODocente
                    {
                        DocenteId = d.DocenteId,
                        Materno = d.Materno,
                        Nombre = d.Nombre,
                        Paterno = d.Paterno,
                        RutaFoto = d.urlImagen,
                    }).FirstOrDefault();

                HttpPostedFile httpFotoDocente = httpFileCollection["FotoDocente"];
                Stream strFoto = httpFotoDocente.InputStream;

                objDocente.RutaFoto = "../Administrador/ImgDocentes/" + DocenteId.ToString() + ext;
                string Ruta = HttpContext.Current.Server.MapPath("../../../Administrador/ImgDocentes/") + DocenteId.ToString() + ext;

                if (File.Exists(Ruta))
                {
                    File.Delete(Ruta);
                }
                File.WriteAllBytes(Ruta, Tools.ConvertirStream(strFoto, httpFotoDocente.ContentLength)); // Write the file.

            }
            catch { objDocente = null; }
            if (objDocente != null)
            {
                try
                {
                    Docente objUpdate = db.Docente.Where(d => d.DocenteId == objDocente.DocenteId).FirstOrDefault();
                    objUpdate.urlImagen = objDocente.RutaFoto;

                    db.SaveChanges();
                }
                catch {  }
            }
        }
        #endregion
        #region Alumno
        [HttpGet]
        [ActionName("ObtenerDocentes")]
        public List<DTO.DTODocenteMateriaDB> ObtenerDocentes(string AlumnoId)
        {
            try
            {
                List<DTODocenteMateriaDB> lstDocentes = new List<DTODocenteMateriaDB>();
                List<AlumnoMateria> lstMateriasA = db.AlumnoMateria.Where(
                                    A => A.AlumnoId == AlumnoId).ToList();

                lstMateriasA.ForEach(alumn =>
                {
                    DTODocenteMateriaDB objDocente = new DTODocenteMateriaDB();
                    objDocente.CarreraId = alumn.CarreraId;
                    objDocente.CarreraS = alumn.Carrera.Descripcion;
                    objDocente.MateriaId = alumn.MateriaId;
                    objDocente.MateriaS = alumn.Materia.Descripcion;
                    objDocente.DocenteId = alumn.DocenteId;
                    objDocente.NombreDocente = alumn.Docente.Nombre + " " + alumn.Docente.Paterno + " " + alumn.Docente.Materno;
                    objDocente.RutaFoto = alumn.Docente.urlImagen;
                    objDocente.PeriodoId = alumn.PeriodoId;
                    objDocente.PeriodoS = alumn.Periodo.Descripcion;
                    objDocente.AlumnoMateriaId = alumn.AlumnoMateriaId;

                    lstDocentes.Add(objDocente);
                });
                return lstDocentes;
            }
            catch
            { return null; }
        }
        #endregion
    }
}