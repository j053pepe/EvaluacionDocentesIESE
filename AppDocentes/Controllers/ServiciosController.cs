using AppDocentes.Models;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Services.Controllers
{
    public class ServiciosController : ApiController
    {
        private IESEEntities db = new IESEEntities();
        #region Administrador
        [HttpGet]
        [ActionName("TraerTodosServicios")]
        public List<DTO.DTOServicios> TraerTodosServicios()
        {
            return db.Categorias
                               .Where(k => k.CategoriaId != 3)
                               .Select(p =>
                                   new DTOServicios
                                   {
                                       ServicioId = p.CategoriaId,
                                       Descripcion = p.Descripcion
                                   })
                               .ToList();
        }

        [HttpGet]
        [ActionName("ObtenerPeriodos")]
        public DTODocenteReporte ObtenerPeriodos(int ServicioId)
        {
            try
            {
                var Sistema = (from a in db.PreguntaServicios
                               where a.CategoriaId == ServicioId
                               select a.EsSabatino)
                                  .GroupBy(k => k).ToList().Select(O => O.FirstOrDefault()).ToList();
                DTODocenteReporte objd = new DTODocenteReporte();
                objd.DocenteId = ServicioId;
                objd.Nombre = db.Categorias.Where(k => k.CategoriaId == ServicioId).FirstOrDefault().Descripcion;
                objd.Sistema = new List<DTOSistemaR>();

                #region Todos
                List<DTOPeriodosR> lstPEriodost = new List<DTOPeriodosR>();


                var periodost = (from a in db.PreguntaServicios
                                 where a.CategoriaId == ServicioId
                                 select a.PeriodoId)
                              .GroupBy(k => k).ToList().Select(O => O.FirstOrDefault()).ToList();
                periodost.ForEach(p =>
                {
                    var carrerast = (from a in db.PreguntaServicios
                                     where a.CategoriaId == ServicioId && a.PeriodoId == p
                                     select a.CarreraId)
                             .GroupBy(k => k).ToList().Select(O => O.FirstOrDefault()).ToList();
                    lstPEriodost.Add(new DTOPeriodosR
                    {
                        Descripcion = db.Periodo.Where(p1 => p1.PeriodoId == p).FirstOrDefault().Descripcion,
                        PeriodoId = p,
                        Carreras = db.Carrera.Where(c => carrerast.Contains(c.CarreraId))
                                        .Select(c =>
                                            new DTOCarrerasR
                                            {
                                                CarreraId = c.CarreraId,
                                                Descripcion = c.Descripcion
                                            }).ToList()
                    });
                });

                objd.Sistema.Add(
                        new DTOSistemaR
                        {
                            SistemaId = -1,
                            Descripcion = "--Todos--",
                            Periodos = lstPEriodost
                        });
                #endregion

                #region Sistema Sabatino y Escolarizado
                Sistema.ForEach(l =>
                {
                    int sistemaEsc = l ? 1 : 2;
                    List<DTOPeriodosR> lstPEriodos = new List<DTOPeriodosR>();


                    var periodos = (from a in db.PreguntaServicios
                                    where a.CategoriaId == ServicioId && a.EsSabatino == l
                                    select a.PeriodoId)
                                  .GroupBy(k => k).ToList().Select(O => O.FirstOrDefault()).ToList();
                    periodos.ForEach(p =>
                    {
                        var carreras = (from a in db.PreguntaServicios
                                        where a.CategoriaId == ServicioId && a.EsSabatino == l && a.PeriodoId == p
                                        select a.CarreraId)
                                 .GroupBy(k => k).ToList().Select(O => O.FirstOrDefault()).ToList();
                        lstPEriodos.Add(new DTOPeriodosR
                        {
                            Descripcion = db.Periodo.Where(p1 => p1.PeriodoId == p).FirstOrDefault().Descripcion,
                            PeriodoId = p,
                            Carreras = db.Carrera.Where(c => carreras.Contains(c.CarreraId))
                                            .Select(c =>
                                                new DTOCarrerasR
                                                {
                                                    CarreraId = c.CarreraId,
                                                    Descripcion = c.Descripcion
                                                }).ToList()
                        });
                    });

                    objd.Sistema.Add(
                            new DTOSistemaR
                            {
                                SistemaId = sistemaEsc,
                                Descripcion = l == true ? "Sabatino" : "Escolarizado",
                                Periodos = lstPEriodos
                            });
                });
                #endregion

                return objd;
            }
            catch { return null; }
        }
        #endregion
        #region Alumno
        [HttpGet]
        [ActionName("TraerServicios")]
        public List<DTO.DTOServicios> TraerServicios(string AlumnoId)
        {

            try
            {
                var objPeriodo = db.Periodo.Where(P =>
                                     DateTime.Now >= P.FechaInicio
                                     && DateTime.Now <= P.FechaFin).FirstOrDefault();

                var objAlumno = db.Alumno.Where(al => al.AlumnoId == AlumnoId).FirstOrDefault();


                int TipoCarrera = objAlumno.HistorialAlumno.FirstOrDefault().Carrera.TipoCarreraId;
                var Carrera = objAlumno.HistorialAlumno.FirstOrDefault().Carrera;


                var Configuracion = db.ConfiguracionEncuesta
                                             .Where(p => p.PeriodoId == objPeriodo.PeriodoId
                                                     && p.TipoCarreraId == TipoCarrera
                                                     && p.Estatus == true).ToList();

                var Pregunta = Configuracion.FirstOrDefault()
                                    .Encuesta.Select(E => E.Pregunta).Where(o => o.ConfiguracionPregunta.CategoriaId != 3).ToList(); ;

                var Servicios = Pregunta.Where(P => !objAlumno.AlumnoPruebaServicio.Where(al => al.PeriodoId == objPeriodo.PeriodoId)
                                                        .Select(al => al.ServicioId).ToArray().Contains(Convert.ToInt32(P.ConfiguracionPregunta.CategoriaId))).GroupBy(l => l.ConfiguracionPregunta.CategoriaId).Select(o => o.Key).ToList();

                return db.Categorias.Where(k => Servicios.Contains(k.CategoriaId))
                                    .Select(k => new DTOServicios
                                    {
                                        Descripcion = k.Descripcion,
                                        ServicioId = k.CategoriaId,
                                        CarreraId = Carrera.CarreraId,
                                        Carrera = Carrera.Descripcion,
                                        PeriodoId = objPeriodo.PeriodoId,
                                        PeriodoS = objPeriodo.Descripcion,
                                        Sabatino = objAlumno.EsSabatino
                                    }).ToList();
            }
            catch
            {
                return null;
            }
        }
        #endregion
    }
}