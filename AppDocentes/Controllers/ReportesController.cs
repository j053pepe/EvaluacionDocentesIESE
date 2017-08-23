using AppDocentes.Models;
using DTO;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Services.Controllers
{
    public class ReportesController : ApiController
    {
        private IESEEntities db = new IESEEntities();

        [HttpGet]
        [ActionName("OBtenerDocente")]
        public DTO.DTODocenteReporte OBtenerDocente(string DocenteId)
        {
            int DocenteId2 = int.Parse(DocenteId);

            db.Configuration.LazyLoadingEnabled = true;
            var list = db.PreguntaDocente.Where(k =>
                    k.DocenteId == DocenteId2).AsNoTracking().ToList();
            #region Periodo -> Carrera -> Materia
            DTODocenteReporte objDocente;
            if (list.Count > 0)
            {
                objDocente = new DTODocenteReporte
                {
                    Nombre = list.FirstOrDefault().Docente.Nombre + " "
                                + list.FirstOrDefault().Docente.Paterno + " "
                                    + list.FirstOrDefault().Docente.Materno,
                    DocenteId = list.FirstOrDefault().Docente.DocenteId,
                    ImgDocente = list.FirstOrDefault().Docente.urlImagen,
                    Sistema = list.GroupBy(k => k.EsSabatino)
                        .Select(K => new DTOSistemaR
                        {
                            Descripcion = K.FirstOrDefault().EsSabatino ? "Sabatino" : "Escolarizado",
                            SistemaId = K.FirstOrDefault().EsSabatino ? 1 : 0,
                            Periodos = list.Where(o => o.EsSabatino).GroupBy(k =>
                                              k.PeriodoId).OrderBy(k =>
                                                  k.FirstOrDefault().PeriodoId).Select(k =>
                                                      new DTOPeriodosR
                                                      {
                                                          PeriodoId = k.FirstOrDefault().PeriodoId,
                                                          Descripcion = k.FirstOrDefault().Periodo.Descripcion
                                                      }).ToList()
                        }).ToList()
                };

                objDocente.Sistema.Add(new DTOSistemaR
                {
                    Descripcion = "Todos",
                    SistemaId = -1,
                    Periodos = list.GroupBy(k =>
                                              k.PeriodoId).OrderBy(k =>
                                                  k.FirstOrDefault().PeriodoId).Select(k =>
                                                      new DTOPeriodosR
                                                      {
                                                          PeriodoId = k.FirstOrDefault().PeriodoId,
                                                          Descripcion = k.FirstOrDefault().Periodo.Descripcion,
                                                          Carreras = k.GroupBy(
                                                              l => l.CarreraId).OrderBy(l =>
                                                                  l.FirstOrDefault().CarreraId)
                                                                      .Select(l =>
                                                                          new DTOCarrerasR
                                                                          {
                                                                              CarreraId = l.FirstOrDefault().CarreraId,
                                                                              Descripcion = l.FirstOrDefault().Carrera.Descripcion,
                                                                              Materias = l.GroupBy(M =>
                                                                                  M.MateriaId).OrderBy(M =>
                                                                                      M.FirstOrDefault().MateriaId)
                                                                                          .Select(M =>
                                                                                              new DTOMateriasR
                                                                                              {
                                                                                                  MateriaId = M.FirstOrDefault().MateriaId,
                                                                                                  Descripcion = M.FirstOrDefault().Materia.Descripcion
                                                                                              }).ToList()
                                                                          }).ToList()
                                                      }).ToList(),
                });
                objDocente.Sistema.ForEach(k1 =>
                {
                    if (k1.SistemaId == 1)
                    {
                        k1.Periodos = list.Where(o => o.EsSabatino).GroupBy(k =>
                                          k.PeriodoId).OrderBy(k =>
                                              k.FirstOrDefault().PeriodoId).Select(k =>
                                                  new DTOPeriodosR
                                                  {
                                                      PeriodoId = k.FirstOrDefault().PeriodoId,
                                                      Descripcion = k.FirstOrDefault().Periodo.Descripcion,
                                                      Carreras = k.GroupBy(
                                                              l => l.CarreraId).OrderBy(l =>
                                                                  l.FirstOrDefault().CarreraId)
                                                                      .Select(l =>
                                                                          new DTOCarrerasR
                                                                          {
                                                                              CarreraId = l.FirstOrDefault().CarreraId,
                                                                              Descripcion = l.FirstOrDefault().Carrera.Descripcion,
                                                                              Materias = l.GroupBy(M =>
                                                                                  M.MateriaId).OrderBy(M =>
                                                                                      M.FirstOrDefault().MateriaId)
                                                                                          .Select(M =>
                                                                                              new DTOMateriasR
                                                                                              {
                                                                                                  MateriaId = M.FirstOrDefault().MateriaId,
                                                                                                  Descripcion = M.FirstOrDefault().Materia.Descripcion
                                                                                              }).ToList()
                                                                          }).ToList()
                                                  }).ToList();
                    }
                    else if (k1.SistemaId == 0)
                    {
                        k1.Periodos = list.Where(o => !o.EsSabatino).GroupBy(k =>
                                             k.PeriodoId).OrderBy(k =>
                                                 k.FirstOrDefault().PeriodoId).Select(k =>
                                                     new DTOPeriodosR
                                                     {
                                                         PeriodoId = k.FirstOrDefault().PeriodoId,
                                                         Descripcion = k.FirstOrDefault().Periodo.Descripcion,
                                                         Carreras = k.GroupBy(
                                                                 l => l.CarreraId).OrderBy(l =>
                                                                     l.FirstOrDefault().CarreraId)
                                                                         .Select(l =>
                                                                             new DTOCarrerasR
                                                                             {
                                                                                 CarreraId = l.FirstOrDefault().CarreraId,
                                                                                 Descripcion = l.FirstOrDefault().Carrera.Descripcion,
                                                                                 Materias = l.GroupBy(M =>
                                                                                     M.MateriaId).OrderBy(M =>
                                                                                         M.FirstOrDefault().MateriaId)
                                                                                             .Select(M =>
                                                                                                 new DTOMateriasR
                                                                                                 {
                                                                                                     MateriaId = M.FirstOrDefault().MateriaId,
                                                                                                     Descripcion = M.FirstOrDefault().Materia.Descripcion
                                                                                                 }).ToList()
                                                                             }).ToList()
                                                     }).ToList();
                    }
                });
            }
            else
            {

                return new DTODocenteReporte
                {
                    DocenteId = 5,
                    Nombre = db.Docente.Where(k => k.DocenteId == DocenteId2).FirstOrDefault().Nombre
                };
            }
            #endregion

            return objDocente;
        }

        /// <summary>
        /// Proceso que trae las preguntas con sus respectivos numero de contestadas
        /// </summary>
        /// <param name="ServicioId">Servicio al que pertenece (Biblioteca, Lab..., etc..)</param>
        /// <param name="PeriodoId">Periodo para el cual se genera el reporte, -1 Todos</param>
        /// <param name="CarreraId">Carrera para el cual se genera, -1 Todos</param>
        /// <param name="Sistema">1-> Sabatino, 2-> Escolarizado, -1 Todos</param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GenerarReportes")]
        public List<DTO.DTOReporte> GenerarReportes(string Docente, string Sabatino, string Periodo, string Carrera, string MateriaId)
        {
            int DocenteId = int.Parse(Docente), PeriodoId = int.Parse(Periodo), Carrera2 = int.Parse(Carrera), Sistema = int.Parse(Sabatino);
            db.Configuration.LazyLoadingEnabled = true;
            try
            {
                #region Preguntas
                var Preguntas =
                    //Todos
                    DocenteId != -1 && Sistema == -1 ?
                    (db.PreguntaDocente
                                .Where(PD =>
                                    PD.DocenteId == DocenteId).AsNoTracking().ToList()) :
                     //Sabatino
                     DocenteId != -1 && Sistema == 1 ?
                     (db.PreguntaDocente
                                .Where(PD =>
                                    PD.DocenteId == DocenteId
                                    && PD.EsSabatino).AsNoTracking().ToList()) :
                     //Escolarizado
                     DocenteId != -1 && Sistema == 0 ?
                      (db.PreguntaDocente
                                .Where(PD =>
                                    PD.DocenteId == DocenteId
                                    && !PD.EsSabatino).AsNoTracking().ToList()) : null;

                if (PeriodoId != -1 && Preguntas != null)
                {
                    Preguntas = Preguntas.Where(P =>
                                    P.PeriodoId == PeriodoId).ToList();
                    if (Carrera2 != -1)
                    {
                        Preguntas = Preguntas.Where(P =>
                                    P.CarreraId == Carrera2).ToList();
                        if (MateriaId != "-1")
                        {
                            Preguntas = Preguntas.Where(P =>
                                    P.MateriaId == MateriaId).ToList();
                        }
                    }
                }
                #endregion

                #region Creacion de listas
                List<DTOReporte> ListaPreguntas =
                                Preguntas
                                    .GroupBy(P => P.PreguntaId)
                                        .OrderBy(P => P.FirstOrDefault().PreguntaId)
                                            .Select(P =>
                                                new DTOReporte
                                                {
                                                    CarreraId = P.FirstOrDefault().CarreraId,
                                                    EsSabatino = P.FirstOrDefault().EsSabatino,
                                                    MateriaId = P.FirstOrDefault().MateriaId,
                                                    PeriodoId = P.FirstOrDefault().PeriodoId,
                                                    PreguntaDescripcion = P.FirstOrDefault().Pregunta.Descripcion,
                                                    PreguntaId = P.FirstOrDefault().PreguntaId
                                                }).ToList();

                ListaPreguntas.ForEach(OP =>
                {
                    OP.clavesOpcion = Preguntas
                    .Where(op => op.PreguntaId == OP.PreguntaId)
                        .GroupBy(op => op.OpcionPreguntaId)
                            .Select(op => op.FirstOrDefault()
                                .OpcionPregunta.ClaveOpcionId)
                                    .ToArray();

                    OP.Opciones = db.OpcionPregunta
                        .Where(o => OP.clavesOpcion.Contains(o.ClaveOpcionId))
                            .Select(K =>
                                new DTOOpcionesR
                                {
                                    Descripcion = K.Descripcion,
                                    OpcionPreguntaId = K.OpcionPreguntaId
                                }).AsNoTracking().ToList();

                    OP.Opciones.ForEach(OP2 =>
                    {
                        OP2.TotalA = Preguntas
                            .Where(P =>
                                P.PreguntaId == OP.PreguntaId
                                && P.OpcionPreguntaId == OP2.OpcionPreguntaId)
                                    .ToList().Count();
                    });
                });

                #endregion

                return ListaPreguntas;
            }
            catch { return null; }
        }

        /// <summary>
        /// Proceso que trae las preguntas con sus respectivos numero de contestadas
        /// </summary>
        /// <param name="ServicioId">Servicio al que pertenece (Biblioteca, Lab..., etc..)</param>
        /// <param name="PeriodoId">Periodo para el cual se genera el reporte, -1 Todos</param>
        /// <param name="CarreraId">Carrera para el cual se genera, -1 Todos</param>
        /// <param name="Sistema">1-> Sabatino, 2-> Escolarizado, -1 Todos</param>
        /// <returns></returns>
        [HttpGet]
        [ActionName("GenerarReportesServicios")]
        public List<DTO.DTOReporte> GenerarReportesServicios(string Servicio, string Sabatino, string Periodo, string Carrera)
        {
            int ServicioId = int.Parse(Servicio), PeriodoId = int.Parse(Periodo), CarreraId = int.Parse(Carrera), Sistema = int.Parse(Sabatino);
            try
            {
                #region Preguntas
                var Preguntas =
                    //Todos
                    ServicioId != -1 && Sistema == -1 ?
                    (db.PreguntaServicios
                                .Where(Ps =>
                                    Ps.CategoriaId == ServicioId).AsNoTracking().ToList()) :
                     //Sabatino
                     ServicioId != -1 && Sistema == 1 ?
                     (db.PreguntaServicios
                                .Where(Ps =>
                                    Ps.CategoriaId == ServicioId
                                    && Ps.EsSabatino).AsNoTracking().ToList()) :
                     //Escolarizado
                     ServicioId != -1 && Sistema == 2 ?
                      (db.PreguntaServicios
                                .Where(Ps =>
                                    Ps.CategoriaId == ServicioId
                                    && !Ps.EsSabatino).AsNoTracking().ToList()) : null;


                if (PeriodoId != -1 && Preguntas != null)
                {
                    Preguntas = Preguntas.Where(P =>
                                    P.PeriodoId == PeriodoId).ToList();
                    if (CarreraId != -1)
                    {
                        Preguntas = Preguntas.Where(P =>
                                    P.CarreraId == CarreraId).ToList();
                    }
                }
                #endregion

                #region Creacion de Lista
                List<DTOReporte> ListaPreguntas =
                              Preguntas
                                  .GroupBy(P => P.PreguntaId)
                                      .OrderBy(P => P.FirstOrDefault().PreguntaId)
                                          .Select(P =>
                                              new DTOReporte
                                              {
                                                  CarreraId = P.FirstOrDefault().CarreraId,
                                                  EsSabatino = P.FirstOrDefault().EsSabatino,
                                                  PeriodoId = P.FirstOrDefault().PeriodoId,
                                                  PreguntaDescripcion = P.FirstOrDefault().Pregunta.Descripcion,
                                                  PreguntaId = P.FirstOrDefault().PreguntaId
                                              }).ToList();

                ListaPreguntas.ForEach(OP =>
                {
                    OP.clavesOpcion = Preguntas
                    .Where(op => op.PreguntaId == OP.PreguntaId)
                        .GroupBy(op => op.OpcionPreguntaId)
                            .Select(op => op.FirstOrDefault()
                                .OpcionPregunta.ClaveOpcionId)
                                    .ToArray();

                    OP.Opciones = db.OpcionPregunta
                        .Where(o => OP.clavesOpcion.Contains(o.ClaveOpcionId))
                            .Select(K =>
                                new DTOOpcionesR
                                {
                                    Descripcion = K.Descripcion,
                                    OpcionPreguntaId = K.OpcionPreguntaId
                                }).AsNoTracking().ToList();

                    OP.Opciones.ForEach(OP2 =>
                    {
                        OP2.TotalA = Preguntas
                            .Where(P =>
                                P.PreguntaId == OP.PreguntaId
                                && P.OpcionPreguntaId == OP2.OpcionPreguntaId)
                                    .ToList().Count();
                    });
                });
                #endregion

                return ListaPreguntas;
            }
            catch { return null; }
        }

        [HttpGet]
        [ActionName("GenerarComentarios")]
        public List<DTO.DTOReporteComentarios> GenerarComentarios(string Docente, string Sabatino, string Periodo, string Carrera, string MateriaId)
        {
            int DocenteId = int.Parse(Docente), PeriodoId = int.Parse(Periodo), Carrera2 = int.Parse(Carrera), Sistema = int.Parse(Sabatino);

            db.Configuration.LazyLoadingEnabled = true;
            try
            {
                #region Preguntas
                var Preguntas =
                    //Todos
                    DocenteId != -1 && Sistema == -1 ?
                    (db.ComentarioDocente
                                .Where(PD =>
                                    PD.DocenteId == DocenteId).AsNoTracking().ToList()) :
                     //Sabatino
                     DocenteId != -1 && Sistema == 1 ?
                     (db.ComentarioDocente
                                .Where(PD =>
                                    PD.DocenteId == DocenteId
                                    && PD.EsSabatino).AsNoTracking().ToList()) :
                     //Escolarizado
                     DocenteId != -1 && Sistema == 0 ?
                      (db.ComentarioDocente
                                .Where(PD =>
                                    PD.DocenteId == DocenteId
                                    && !PD.EsSabatino).AsNoTracking().ToList()) : null;

                if (PeriodoId != -1 && Preguntas != null)
                {
                    Preguntas = Preguntas.Where(P =>
                                    P.PeriodoId == PeriodoId).ToList();
                    if (Carrera2 != -1)
                    {
                        Preguntas = Preguntas.Where(P =>
                                    P.CarreraId == Carrera2).ToList();
                        if (MateriaId != "-1")
                        {
                            Preguntas = Preguntas.Where(P =>
                                    P.MateriaId == MateriaId).ToList();
                        }
                    }
                }
                #endregion

                #region Creacion de listas
                List<DTOReporteComentarios> ListaPreguntas =
                                Preguntas
                                    .Select(P =>
                                                new DTOReporteComentarios
                                                {
                                                    ComentarioId = P.ComentarioDocenteId,
                                                    Comentario = P.Comentario
                                                }).ToList();

                #endregion

                return ListaPreguntas;
            }
            catch { return null; }
        }

        [HttpGet]
        [ActionName("GenerarComentariosServicios")]
        public List<DTO.DTOReporteComentarios> GenerarComentariosServicios(string Servicio, string Sabatino, string Periodo, string Carrera)
        {
            int ServicioId = int.Parse(Servicio), PeriodoId = int.Parse(Periodo), CarreraId = int.Parse(Carrera), Sistema = int.Parse(Sabatino);
            try
            {
                #region Preguntas
                var Preguntas =
                    //Todos
                    ServicioId != -1 && Sistema == -1 ?
                    (db.ComentarioServicios
                                .Where(Ps =>
                                    Ps.CategoriaId == ServicioId).AsNoTracking().ToList()) :
                     //Sabatino
                     ServicioId != -1 && Sistema == 1 ?
                     (db.ComentarioServicios
                                .Where(Ps =>
                                    Ps.CategoriaId == ServicioId
                                    && Ps.EsSabatino).AsNoTracking().ToList()) :
                     //Escolarizado
                     ServicioId != -1 && Sistema == 2 ?
                      (db.ComentarioServicios
                                .Where(Ps =>
                                    Ps.CategoriaId == ServicioId
                                    && !Ps.EsSabatino).AsNoTracking().ToList()) : null;


                if (PeriodoId != -1 && Preguntas != null)
                {
                    Preguntas = Preguntas.Where(P =>
                                    P.PeriodoId == PeriodoId).ToList();
                    if (CarreraId != -1)
                    {
                        Preguntas = Preguntas.Where(P =>
                                    P.CarreraId == CarreraId).ToList();
                    }
                }
                #endregion

                #region Creacion de Lista
                List<DTOReporteComentarios> ListaPreguntas =
                              Preguntas
                                .Select(P =>
                                              new DTOReporteComentarios
                                              {
                                                  ComentarioId = P.ComentarioServicioId,
                                                  Comentario = P.Comentario
                                              }).ToList();
                #endregion

                return ListaPreguntas;
            }
            catch { return null; }
        }
    }
}