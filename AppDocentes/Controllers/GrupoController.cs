using AppDocentes.Models;
using DTO;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Services.Controllers
{
    public class GrupoController : ApiController
    {
        private IESEEntities db = new IESEEntities();

        [HttpPut]
        [ActionName("GuardarDocenteCarreraMateria")]
        public List<DTO.DTODocenteMateriaDB> GuardarDocenteCarreraMateria(JObject jdata)
        {
            dynamic json = jdata;
            string CarreraId, PeriodoId, DocenteId, MateriaId, Sabatino, UsuarioId;
            var a = json.CarreraId;
            var b = json.PeriodoId;
            var c = json.DocenteId;
            var d = json.MateriaId;
            var e = json.Sabatino;
            var f = json.UsuarioId;
            CarreraId = a.ToObject<string>();
            PeriodoId = b.ToObject<string>();
            DocenteId = c.ToObject<string>();
            MateriaId = d.ToObject<string>();
            Sabatino = e.ToObject<string>();
            UsuarioId = f.ToObject<string>();


            try
            {
                db.DocenteMateria.Add(new DocenteMateria
                {
                    CarreraId = int.Parse(CarreraId),
                    DocenteId = int.Parse(DocenteId),
                    EsSabatino = bool.Parse(Sabatino),
                    MateriaId = MateriaId,
                    PeriodoId = int.Parse(PeriodoId),
                    UsuarioId = int.Parse(UsuarioId)
                });
                db.SaveChanges();

                return db.DocenteMateria.Select(K =>
                new DTODocenteMateriaDB
                {
                    CarreraId = K.CarreraId,
                    CarreraS = K.Carrera.Descripcion,
                    UsuarioId = (int)K.UsuarioId,
                    UsuarioS = K.Usuario.Nick,
                    DocenteId = K.DocenteId,
                    NombreDocente = K.Docente.Nombre + " " + K.Docente.Materno + " " + K.Docente.Materno,
                    EsSabatino = K.EsSabatino,
                    MateriaId = K.MateriaId,
                    MateriaS = K.Materia.Descripcion,
                    PeriodoId = K.PeriodoId,
                    PeriodoS = K.Periodo.Descripcion
                }).ToList();
            }
            catch { return null; }
        }

        [HttpGet]
        [ActionName("TraerTodos")]
        public List<DTO.DTODocenteMateriaDB> TraerTodos()
        {
            try
            {
                return db.DocenteMateria.Select(K =>
              new DTODocenteMateriaDB
              {
                  CarreraId = K.CarreraId,
                  CarreraS = K.Carrera.Descripcion,
                  UsuarioId = (int)K.UsuarioId,
                  UsuarioS = K.Usuario.Nick,
                  DocenteId = K.DocenteId,
                  NombreDocente = K.Docente.Nombre + " " + K.Docente.Materno + " " + K.Docente.Materno,
                  EsSabatino = K.EsSabatino,
                  MateriaId = K.MateriaId,
                  MateriaS = K.Materia.Descripcion,
                  PeriodoId = K.PeriodoId,
                  PeriodoS = K.Periodo.Descripcion
              }).ToList();
            }
            catch { return null; }
        }

        [HttpPost]
        [ActionName("TraerAlumnos")]
        public DTO.DTOGrupo TraerAlumnos(JObject jdata)
        {
            dynamic json = jdata;
            string DocenteId, CarreraId, MateriaId, PeriodoId, esSabatino;
            var a = json.DocenteId;
            var b = json.CarreraId;
            var c = json.MateriaId;
            var d = json.PeriodoId;
            var e = json.esSabatino;
            DocenteId = a.ToObject<string>();
            CarreraId = b.ToObject<string>();
            MateriaId = c.ToObject<string>();
            PeriodoId = d.ToObject<string>();
            esSabatino = e.ToObject<string>();

            return TraerAlumnos();

            DTOGrupo TraerAlumnos()
            {
                try
                {
                    DTOGrupo objRegresar = new DTOGrupo();
                    List<DTO.DTOGrupoAlumnos> lstAlumnosLibres = new List<DTOGrupoAlumnos>();
                    List<DTO.DTOGrupoAlumnos> lstAlumnosDocentes = new List<DTOGrupoAlumnos>();
                    int CarreraId2 = int.Parse(CarreraId);
                    int DocenteId2 = int.Parse(DocenteId);
                    int PeriodoId2 = int.Parse(PeriodoId);
                    bool esSabatino2 = bool.Parse(esSabatino);
                    List<Alumno> lstAlumnos =
                    db.Alumno.Where(k =>
                                    k.HistorialAlumno.Where(ha =>
                                        ha.CarreraId == CarreraId2).ToList().Count > 0
                                    && k.EsSabatino == esSabatino2).ToList();

                    lstAlumnosLibres = lstAlumnos.Where(al =>
                          al.AlumnoMateria.Where(am =>
                                              am.DocenteId == DocenteId2
                                              && am.CarreraId == CarreraId2
                                              && am.MateriaId == MateriaId
                                              && am.PeriodoId == PeriodoId2).ToList().Count == 0).
                                         Select(kl =>
                                         new DTOGrupoAlumnos
                                         {
                                             CarreraId = CarreraId2,
                                             CarreraS = kl.HistorialAlumno.Where(ha => ha.CarreraId == CarreraId2).FirstOrDefault().Carrera.Descripcion,
                                             NumeroAlumno = kl.AlumnoId,
                                             Nombre = kl.Nombre + " " + kl.Paterno + " " + kl.Materno
                                         }).ToList();

                    lstAlumnosDocentes = lstAlumnos.Where(al =>
                          al.AlumnoMateria.Where(am =>
                                              am.DocenteId == DocenteId2
                                              && am.CarreraId == CarreraId2
                                              && am.MateriaId == MateriaId
                                              && am.PeriodoId == PeriodoId2).ToList().Count > 0).
                                        Select(kl =>
                                        new DTOGrupoAlumnos
                                        {
                                            CarreraId = CarreraId2,
                                            CarreraS = kl.HistorialAlumno.Where(ha => ha.CarreraId == CarreraId2).FirstOrDefault().Carrera.Descripcion,
                                            NumeroAlumno = kl.AlumnoId,
                                            Nombre = kl.Nombre + " " + kl.Paterno + " " + kl.Materno
                                        }).ToList();
                    objRegresar.lstAlumnosDocenteMateria = lstAlumnosDocentes;
                    objRegresar.lstAlumnosLibres = lstAlumnosLibres;
                    return objRegresar;
                    //lstAlumnosLibres=db.
                }
                catch { return null; }
            }
        }

        [HttpPut]
        [ActionName("GuardarAlumnos")]
        public DTO.DTODocenteMateriaDB GuardarAlumnos(JObject jdata)
        {
            dynamic json = jdata;
            string DocenteId, CarreraId, MateriaId, PeriodoId, UsuarioId, EsSabatino, Alumnos;
            var a = json.DocenteId;
            var b = json.CarreraId;
            var c = json.MateriaId;
            var d = json.PeriodoId;
            var e = json.UsuarioId;
            var f = json.EsSabatino;
            var g = json.Alumnos;

            DocenteId = a.ToObject<string>();
            CarreraId = b.ToObject<string>();
            MateriaId = c.ToObject<string>();
            PeriodoId = d.ToObject<string>();
            UsuarioId = e.ToObject<string>();
            EsSabatino = f.ToObject<string>();
            Alumnos = g.ToObject<string>();

            int DocenteId2 = int.Parse(DocenteId),
                CarreraId2 = int.Parse(CarreraId),
                PeriodoId2 = int.Parse(PeriodoId),
                UsuatioId = int.Parse(UsuarioId);
            bool EsSabatino2 = bool.Parse(EsSabatino);
            try
            {
                List<string> lstAlumnos = Alumnos.Split(',').ToList();
                lstAlumnos.ForEach(al =>
                {

                    db.AlumnoMateria.Add(
                        new AlumnoMateria
                        {
                            AlumnoId = al,
                            CarreraId = CarreraId2,
                            DocenteId = DocenteId2,
                            FechaAlta = DateTime.Now,
                            MateriaId = MateriaId,
                            PeriodoId = PeriodoId2,
                            UsuarioId = UsuatioId
                        });
                });

                db.SaveChanges();
                return db.DocenteMateria
                    .Where(ko => ko.CarreraId == CarreraId2
                                && ko.DocenteId == DocenteId2
                                && ko.PeriodoId == PeriodoId2
                                && ko.EsSabatino == EsSabatino2)
                    .Select(
                    K =>
                        new DTODocenteMateriaDB
                        {
                            CarreraId = K.CarreraId,
                            CarreraS = K.Carrera.Descripcion,
                            UsuarioId = (int)K.UsuarioId,
                            UsuarioS = K.Usuario.Nick,
                            DocenteId = K.DocenteId,
                            NombreDocente = K.Docente.Nombre + " " + K.Docente.Materno + " " + K.Docente.Materno,
                            EsSabatino = K.EsSabatino,
                            MateriaId = K.MateriaId,
                            MateriaS = K.Materia.Descripcion,
                            PeriodoId = K.PeriodoId,
                            PeriodoS = K.Periodo.Descripcion
                        }
                ).FirstOrDefault();
            }
            catch
            { return null; }
        }

        [HttpDelete]
        [ActionName("EliminarAlumno")]
        public DTO.DTODocenteMateriaDB EliminarAlumno(JObject jdata)
        {
            string DocenteId, CarreraId, MateriaId, PeriodoId, EsSabatino, AlumnoId;
            dynamic json = jdata;
            var a = json.DocenteId;
            var b = json.CarreraId;
            var c = json.MateriaId;
            var d = json.PeriodoId;
            var e = json.EsSabatino;
            var f = json.AlumnoId;

            DocenteId = a.ToObject<string>();
            CarreraId = b.ToObject<string>();
            MateriaId = c.ToObject<string>();
            PeriodoId = d.ToObject<string>();
            EsSabatino = e.ToObject<string>();
            AlumnoId = f.ToObject<string>();

            try
            {
                int DocenteId2= int.Parse(DocenteId), 
                    CarreraId2= int.Parse(CarreraId),
                    PeriodoId2= int.Parse(PeriodoId);
                bool EsSabatino2= bool.Parse(EsSabatino);

                  AlumnoMateria objEliminar = db.AlumnoMateria.Where(
                     k =>
                         k.AlumnoId == AlumnoId
                         && k.CarreraId == CarreraId2
                         && k.DocenteId == DocenteId2
                         && k.PeriodoId == PeriodoId2
                         && k.MateriaId == MateriaId).FirstOrDefault();
                if (objEliminar != null)
                {
                    db.AlumnoMateria.Remove(objEliminar);
                }
                db.SaveChanges();

                return db.DocenteMateria
                   .Where(ko => ko.CarreraId == CarreraId2
                               && ko.DocenteId == DocenteId2
                               && ko.PeriodoId == PeriodoId2
                               && ko.EsSabatino == EsSabatino2)
                   .Select(
                   K =>
                       new DTODocenteMateriaDB
                       {
                           CarreraId = K.CarreraId,
                           CarreraS = K.Carrera.Descripcion,
                           UsuarioId = (int)K.UsuarioId,
                           UsuarioS = K.Usuario.Nick,
                           DocenteId = K.DocenteId,
                           NombreDocente = K.Docente.Nombre + " " + K.Docente.Materno + " " + K.Docente.Materno,
                           EsSabatino = K.EsSabatino,
                           MateriaId = K.MateriaId,
                           MateriaS = K.Materia.Descripcion,
                           PeriodoId = K.PeriodoId,
                           PeriodoS = K.Periodo.Descripcion
                       }
               ).FirstOrDefault();
            }
            catch { return null; }
        }
    }
}