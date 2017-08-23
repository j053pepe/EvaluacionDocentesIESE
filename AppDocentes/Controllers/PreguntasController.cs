using AppDocentes.Models;
using DTO;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;

namespace Services.Controllers
{
    public class PreguntasController : ApiController
    {
        private IESEEntities db = new IESEEntities();

        #region Administrador

        [HttpPost]
        [ActionName("GuardarPreguntas")]
        public string GuardarPreguntas(JObject jdata)
        {
            List<DTO.DTOPregunta> Preguntas = new List<DTO.DTOPregunta>(); string UsuarioId;
            string Respuesta = "Error";
            dynamic json = jdata;
            var a = json.Preguntas;
            var b1 = json.UsuarioId;
            UsuarioId = b1.ToObject<string>();
            foreach (JObject pre in a)
            {
                DTO.DTOPregunta ojbp = pre.ToObject<DTO.DTOPregunta>();
                Preguntas.Add(ojbp);
            }

            //var table = Server.HtmlDecode(tableContents);
            DTO.DTOPregunta dtoPRegunta;
            //List<DTO.DTOPregunta> lstPreguntas = new List<DTO.DTOPregunta>();
            try
            {
                foreach (DTO.DTOPregunta obj in Preguntas)
                {
                    dtoPRegunta = new DTO.DTOPregunta();
                    dtoPRegunta.Descripcion = obj.Descripcion;
                    dtoPRegunta.CategoriaId = obj.CategoriaId;
                    dtoPRegunta.TipoCarreraId = obj.TipoCarreraId;
                    dtoPRegunta.UsuarioId = int.Parse(UsuarioId);
                    dtoPRegunta.ClaveOpcionId = 3;

                    if (AddPregunta(dtoPRegunta))
                    {
                        Respuesta = "Correcto";
                    }
                }
            }
            catch (Exception e)
            {
                string b = e.ToString();
            }
                        
            return Respuesta;

            bool AddPregunta(DTOPregunta Pregunta)
            {
                try
                {
                    db.Pregunta.Add(new Pregunta
                    {
                        Descripcion = Pregunta.Descripcion,
                        ConfiguracionPregunta = new ConfiguracionPregunta
                        {
                            CategoriaId = (int)Pregunta.CategoriaId,
                            TipoCarreraId = (int)Pregunta.TipoCarreraId,
                            ClaveOpcionId = (int)Pregunta.ClaveOpcionId
                        },
                        UsuarioId = Pregunta.UsuarioId,
                        Estatus = true
                    });

                    db.SaveChanges();

                    return true;
                }
                catch { return false; }
            }
        }

        [HttpGet]
        [ActionName("CargaTipoCarrera")]
        public List<DTO.DTOTipoCarrera> CargaTipoCarrera()
        {
            try
            {
                return db.TipoCarrera.Select(d => new DTOTipoCarrera
                {
                    TipoCarreraId = d.TipoCarreraId,
                    Descripcion = d.Descripcion
                }).ToList();
            }
            catch { return null; }
        }

        [HttpGet]
        [ActionName("CargaCategorias")]
        public List<DTO.DTOCategoria> CargaCategorias()
        {
            try
            {
                return db.Categorias.Select(d => new DTOCategoria
                {
                    CategoriaId = d.CategoriaId,
                    Descripcion = d.Descripcion,
                    UsuarioId = d.UsuarioId
                }).ToList();
            }
            catch { return null; }
        }

        [HttpGet]
        public List<DTO.DTOPregunta> CargarPreguntas()
        {
            try
            {
                return db.Pregunta.Select(d => new DTOPregunta
                {
                    PreguntaId = d.PreguntaId,
                    Descripcion = d.Descripcion,
                    ClaveOpcionId = (int)d.ConfiguracionPregunta.ClaveOpcionId,
                    UsuarioId = d.UsuarioId,
                    CategoriaId = (int)d.ConfiguracionPregunta.CategoriaId

                }).ToList();
            }
            catch { return null; }
        }

        [HttpPost]
        [ActionName("CargarPreguntasPorCategoria")]
        public List<DTO.DTOPregunta> CargarPreguntasPorCategoria(JObject jdata)
        {
            dynamic json = jdata;
            int ConfiguracionEncuestaId, CategoriaId;
            var a2 = json.ConfiguracionEncuestaId;
            var b2 = json.CategoriaId;
            ConfiguracionEncuestaId = a2.ToObject<int>();
            CategoriaId = b2.ToObject<int>();

            try
            {
                return (from a in db.Pregunta
                        where !(from b in db.ConfiguracionEncuesta
                                join c in db.Encuesta on b.ConfiguracionEncuestaId equals c.ConfiguracionEncuestaId
                                where b.ConfiguracionEncuestaId == ConfiguracionEncuestaId
                                select c.PreguntaId).Contains(a.PreguntaId) && a.ConfiguracionPregunta.CategoriaId == CategoriaId
                                && a.Estatus != false
                        select new DTOPregunta
                        {
                            PreguntaId = a.PreguntaId,
                            Descripcion = a.Descripcion,
                            ClaveOpcionId = (int)a.ConfiguracionPregunta.ClaveOpcionId,
                            UsuarioId = a.UsuarioId,
                            CategoriaId = (int)a.ConfiguracionPregunta.CategoriaId

                        }).ToList();
            }
            catch { return null; }

        }

        [HttpGet]
        [ActionName("ObtenerPreguntasSistema")]
        public List<DTO.DTOPreguntaAll> ObtenerPreguntasSistema()
        {
            try
            {
                return (from a in db.Pregunta
                        join c in db.ConfiguracionPregunta on a.PreguntaId equals c.PreguntaId
                        join b in db.TipoCarrera on c.TipoCarreraId equals b.TipoCarreraId

                        where a.Estatus != false
                        select new DTOPreguntaAll
                        {
                            PreguntaId = a.PreguntaId,
                            CategoriaId = (int)c.CategoriaId,
                            CategoriaDescripcion = c.Categorias.Descripcion,
                            Descripcion = a.Descripcion
                        }).ToList();

            }
            catch (Exception e)
            {
                string b = e.ToString(); return null;
            }
        }

        [HttpPut]
        [ActionName("GuardarEncuesta")]
        public string GuardarEncuesta(JObject jdata)
        {
            dynamic json = jdata;
            string ConfiguracionEncuestaId, PreguntaId, IdUsuario;
            string Respuesta = "Error";

            var a = json.ConfiguracionEncuestaId;
            var b = json.PreguntaId;
            var c = json.IdUsuario;
            ConfiguracionEncuestaId = a.ToObject<string>();
            PreguntaId = b.ToObject<string>();
            IdUsuario = c.ToObject<string>();

            DTO.DTOEncuesta dtoEncuesta;
            try
            {
                dtoEncuesta = new DTO.DTOEncuesta();
                dtoEncuesta.ConfiguracionEncuestaId = Convert.ToInt32(ConfiguracionEncuestaId);
                dtoEncuesta.PreguntaId = Convert.ToInt32(PreguntaId);
                dtoEncuesta.Estatus = 1;
                dtoEncuesta.UsuarioModifico = Convert.ToInt32(IdUsuario);                

                db.Encuesta.Add(new Encuesta
                {
                    //EncuestaId = Encuesta.EncuestaId,
                    ConfiguracionEncuestaId = dtoEncuesta.ConfiguracionEncuestaId,
                    PreguntaId = dtoEncuesta.PreguntaId,
                    FechaModificacion = DateTime.Now,
                    Estatus = dtoEncuesta.Estatus,
                    UsuarioModifico = dtoEncuesta.UsuarioModifico
                });

                db.SaveChanges();

                Respuesta = "Correcto";
            }
            catch { }
            return Respuesta;
        }

        [HttpPost]
        [ActionName("ObtenerEncuesta")]
        public List<DTO.DTOPreguntaAll> ObtenerEncuesta(JObject jdata)
        {
            dynamic json = jdata;
            int ConfiguracionEncuestaId, CategoriaId;
            var a2 = json.ConfiguracionEncuestaId;
            var b2 = json.CategoriaId;
            ConfiguracionEncuestaId = a2.ToObject<int>();
            CategoriaId = b2.ToObject<int>();

            try
            {
                return (from a in db.Pregunta
                        join c in db.Encuesta on a.PreguntaId equals c.PreguntaId
                        join b in db.ConfiguracionEncuesta on c.ConfiguracionEncuestaId equals b.ConfiguracionEncuestaId
                        join d in db.Categorias on a.ConfiguracionPregunta.CategoriaId equals d.CategoriaId
                        where a.ConfiguracionPregunta.CategoriaId == CategoriaId && b.ConfiguracionEncuestaId == ConfiguracionEncuestaId
                        select new DTOPreguntaAll
                        {
                            PreguntaId = a.PreguntaId,
                            CategoriaId = (int)a.ConfiguracionPregunta.CategoriaId,
                            CategoriaDescripcion = d.Descripcion,
                            Descripcion = a.Descripcion,
                            EncuestaId = c.EncuestaId
                        }).ToList();
            }
            catch { return null; }
        }

        [HttpGet]
        public string BorrarPeriodo(string EncuestaId)
        {
            string Respuesta = "Error";

            try
            {
                if (DeleteEncuesta(Convert.ToInt32(EncuestaId)) == true)
                {
                    Respuesta = "Correcto";
                }

            }
            catch { }
            return Respuesta;

            bool DeleteEncuesta(int EncuestaId2)
            {
                try
                {
                    Encuesta objEncuesta = db.Encuesta.Where(doc => doc.EncuestaId == EncuestaId2).FirstOrDefault();
                    db.Encuesta.Remove(objEncuesta);
                    db.SaveChanges();
                    return true;
                }
                catch { return false; }
            }

        }

        [HttpDelete]
        [ActionName("BorrarPregunta")]
        public string BorrarPregunta(JObject jdata)
        {
            string PreguntaId;
            string Respuesta = "Error";
            dynamic json = jdata;
            var a = json.PreguntaId;
            PreguntaId = a.ToObject<string>();

            try
            {
                if (DeletePregunta(Convert.ToInt32(PreguntaId)) == true)
                { Respuesta = "Correcto"; }


            }
            catch { }
            return Respuesta;

            bool DeletePregunta(int PreguntaId2)
            {
                try
                {
                    Pregunta objPregunta = db.Pregunta.Where(d => d.PreguntaId == PreguntaId2).FirstOrDefault();
                    objPregunta.Estatus = false;
                    db.SaveChanges();
                    return true;

                }
                catch { return false; }
            }
        }


        [HttpPut]
        [ActionName("GuardaConfiguracion")]
        public string GuardaConfiguracion(JObject jdata)
        {
            string PeriodoId, TipoCarreraId, UsuarioId;
            string Respuesta = "Error, consulte a su administrador.";
            dynamic json = jdata;
            var a2 = json.PeriodoId;
            var b2 = json.TipoCarreraId;
            var c2 = json.UsuarioId;
            PeriodoId = a2.ToObject<string>();
            TipoCarreraId = b2.ToObject<string>();
            UsuarioId = c2.ToObject<string>();

            DTO.DTOConfiguracionEncuesta objConfiguracionEncuesta;
            try
            {
                if (GetConfiguracionEncuestaByPeriodoTC(Convert.ToInt32(PeriodoId), Convert.ToInt32(TipoCarreraId)) == null)
                {


                    objConfiguracionEncuesta = new DTO.DTOConfiguracionEncuesta();
                    objConfiguracionEncuesta.PeriodoId = Convert.ToInt32(PeriodoId);
                    objConfiguracionEncuesta.TipoCarreraId = Convert.ToInt32(TipoCarreraId);
                    objConfiguracionEncuesta.UsuarioModifico = Convert.ToInt32(UsuarioId);
                    objConfiguracionEncuesta.FechaModificacion = DateTime.Now;
                    if (AddConfiguracionEncuesta(objConfiguracionEncuesta) == true)
                    {
                        Respuesta = "Se guardo correctamente.";
                    }

                }
                else { Respuesta = "La encuesta que desea agregar ya existe en el sistema."; }
            }
            catch { }
            return Respuesta;

            DTOConfiguracionAll GetConfiguracionEncuestaByPeriodoTC(int PeriodoID, int TipoCarreraID)
            {
                try
                {
                    return (from a in db.ConfiguracionEncuesta
                            where a.PeriodoId == PeriodoID && a.TipoCarreraId == TipoCarreraID
                            select new DTOConfiguracionAll
                            {
                                ConfiguracionEncuestaId = a.ConfiguracionEncuestaId,
                                PeriodoId = a.PeriodoId,
                                FechaInicio = a.FechaInicio == null ? "" : a.FechaInicio.ToString(),
                                FechaFin = a.FechaFin == null ? "" : a.FechaFin.ToString(),
                                Estatus = a.Estatus == true ? "1" : "0"

                            }).FirstOrDefault();
                }
                catch (Exception e) { string b = e.ToString(); return null; }
            }

            bool AddConfiguracionEncuesta(DTOConfiguracionEncuesta ConfEncuesta)
            {
                try
                {
                    db.ConfiguracionEncuesta.Add(new ConfiguracionEncuesta
                    {
                        PeriodoId = ConfEncuesta.PeriodoId,
                        TipoCarreraId = ConfEncuesta.TipoCarreraId,
                        Estatus = ConfEncuesta.Estatus,
                        UsuarioModifico = ConfEncuesta.UsuarioModifico
                        ,
                        FechaModificacion = ConfEncuesta.FechaModificacion
                    });
                    db.SaveChanges();
                    return true;
                }
                catch { return false; }
            }
        }

        [HttpGet]
        [ActionName("ObtenerConfiguracion")]
        public List<DTO.DTOConfiguracionAll> ObtenerConfiguracion()
        {
            CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
            List<DTO.DTOConfiguracionAll> lstobjConfiguraciones = CargarConfiguraciones();
            if (lstobjConfiguraciones != null)
            {
                for (int i = 0; i < lstobjConfiguraciones.Count; i++)
                {
                    lstobjConfiguraciones[i].FechaInicio = lstobjConfiguraciones[i].FechaInicio == "" ? "" : Convert.ToDateTime(lstobjConfiguraciones[i].FechaInicio).ToString("dd/MM/yyyy", Cultura);
                    lstobjConfiguraciones[i].FechaFin = lstobjConfiguraciones[i].FechaFin == "" ? "" : Convert.ToDateTime(lstobjConfiguraciones[i].FechaFin).ToString("dd/MM/yyyy", Cultura);

                }
            }
            return lstobjConfiguraciones;

            List<DTOConfiguracionAll> CargarConfiguraciones()
            {
                try
                {
                    return (from a in db.ConfiguracionEncuesta
                            join b in db.Periodo on a.PeriodoId equals b.PeriodoId
                            join c in db.TipoCarrera on a.TipoCarreraId equals c.TipoCarreraId
                            select new DTOConfiguracionAll
                            {
                                ConfiguracionEncuestaId = a.ConfiguracionEncuestaId,
                                DescripcionPeriodo = b.Descripcion,
                                DescripcionTipoCarrera = c.Descripcion,
                                FechaInicio = a.FechaInicio == null ? "" : a.FechaInicio.ToString(),
                                FechaFin = a.FechaFin == null ? "" : a.FechaFin.ToString(),
                                Estatus = a.Estatus == true ? "Activa" : "Inactiva",
                                ConfiguracionEncuestaIdC = a.ConfiguracionEncuestaId
                            }).OrderByDescending(b => b.FechaInicio).ToList();
                }
                catch (Exception e)
                {
                    string b = e.ToString();
                    return null;
                }
            }
        }

        [HttpPost]
        [ActionName("ObtieneEncuestaPorId")]
        public DTO.DTOConfiguracionAll ObtieneEncuestaPorId(JObject jdata)
        {
            dynamic json = jdata;
            CultureInfo Cultura = CultureInfo.CreateSpecificCulture("es-MX");
            string ConfiguracionEncuestaId;
            var a2 = json.ConfiguracionEncuestaId;
            ConfiguracionEncuestaId = a2.ToObject<string>();


            DTO.DTOConfiguracionAll objEncuesta = new DTO.DTOConfiguracionAll();

            objEncuesta = GetConfiguracionEncuestaById(Convert.ToInt32(ConfiguracionEncuestaId));
            objEncuesta.FechaInicio = objEncuesta.FechaInicio == "" ? "" : Convert.ToDateTime(objEncuesta.FechaInicio).ToString("dd/MM/yyyy", Cultura);
            objEncuesta.FechaFin = objEncuesta.FechaFin == "" ? "" : Convert.ToDateTime(objEncuesta.FechaFin).ToString("dd/MM/yyyy", Cultura);

            return objEncuesta;

            DTOConfiguracionAll GetConfiguracionEncuestaById(int ConfiguracionEncuestaIdd)
            {
                try
                {
                    return (from a in db.ConfiguracionEncuesta
                            where a.ConfiguracionEncuestaId == ConfiguracionEncuestaIdd
                            select new DTOConfiguracionAll
                            {
                                ConfiguracionEncuestaId = a.ConfiguracionEncuestaId,
                                PeriodoId = a.PeriodoId,
                                FechaInicio = a.FechaInicio == null ? "" : a.FechaInicio.ToString(),
                                FechaFin = a.FechaFin == null ? "" : a.FechaFin.ToString(),
                                Estatus = a.Estatus == true ? "1" : "0"
                            }).FirstOrDefault();
                }
                catch (Exception e) { string b = e.ToString(); return null; }
            }
        }

        [HttpPut]
        [ActionName("GuardaConfiguarionById")]
        public string GuardaConfiguarionById(JObject jdata)
        {
            string ConfiguracionEncuestaId, FechaInicio, FechaFin, Estatus, UsuarioId;
            string Respuesta = "Error al configurar la encuesta.";
            dynamic json=jdata;
            var a = json.ConfiguracionEncuestaId;
            var b1 = json.FechaInicio;
            var c = json.FechaFin;
            var d = json.Estatus;
            var e1 = json.UsuarioId;
            ConfiguracionEncuestaId = a.ToObject<string>();
            FechaInicio = b1.ToObject<string>();
            FechaFin = c.ToObject<string>();
            Estatus = d.ToObject<string>();
            UsuarioId = e1.ToObject<string>();

            DTO.DTOConfiguracionAll objDtoConf = ObtieneEncuestaPorId(JObject.Parse("{ConfiguracionEncuestaId:" + ConfiguracionEncuestaId + "}"));

            DTO.DTOPeriodo objDtoPer = TraerPeriodoPorID(objDtoConf.PeriodoId);

            if ((Convert.ToDateTime(FechaInicio) >= objDtoPer.FechaInicio && Convert.ToDateTime(FechaInicio) <= objDtoPer.FechaFin)
                &&
                (Convert.ToDateTime(FechaFin) >= objDtoPer.FechaInicio && Convert.ToDateTime(FechaFin) <= objDtoPer.FechaFin))
            {
                if (Convert.ToDateTime(FechaInicio) > Convert.ToDateTime(FechaFin))
                {
                    Respuesta = "La fecha de inicio debe ser menor a la fecha de termino.";
                    return Respuesta;
                }
            }
            else
            {
                Respuesta = "La fecha de inicio y termino deben de estar dentro del periodo seleccionado.";
                return Respuesta;
            }


            DTO.DTOConfiguracionEncuesta objConfiguracionEncuesta;

            try
            {


                objConfiguracionEncuesta = new DTO.DTOConfiguracionEncuesta();
                objConfiguracionEncuesta.ConfiguracionEncuestaId = Convert.ToInt32(ConfiguracionEncuestaId);
                objConfiguracionEncuesta.FechaFin = Convert.ToDateTime(FechaFin);
                objConfiguracionEncuesta.FechaInicio = Convert.ToDateTime(FechaInicio);
                objConfiguracionEncuesta.Estatus = Convert.ToBoolean(Convert.ToInt32(Estatus));
                objConfiguracionEncuesta.UsuarioModifico = Convert.ToInt32(UsuarioId);
                ModificaConfiguracionEncuesta(objConfiguracionEncuesta);

                Respuesta = "Se configuro correctamente la encuesta.";
            }
            catch (Exception e)
            {
                string b = e.ToString();
            }
            return Respuesta;

            DTOPeriodo TraerPeriodoPorID(int PeriodoID)
            {
                return db.Periodo.Where(I => I.PeriodoId == PeriodoID)
                    .Select(d2 => new DTOPeriodo
                    {
                        PeriodoId = d2.PeriodoId,
                        Descripcion = d2.Descripcion,
                        FechaInicio = d2.FechaInicio,
                        FechaFin = d2.FechaFin
                    }).FirstOrDefault();
            }

            int ModificaConfiguracionEncuesta(DTOConfiguracionEncuesta ConfEncuesta)
            {
                try
                {
                    ConfiguracionEncuesta objCE = db.ConfiguracionEncuesta
                                            .Where(d2 => d2.ConfiguracionEncuestaId == ConfEncuesta.ConfiguracionEncuestaId)
                                            .FirstOrDefault();

                    objCE.FechaInicio = ConfEncuesta.FechaInicio;
                    objCE.FechaFin = ConfEncuesta.FechaFin;
                    objCE.Estatus = ConfEncuesta.Estatus;
                    objCE.UsuarioModifico = ConfEncuesta.UsuarioModifico;

                    db.SaveChanges();

                    return objCE.ConfiguracionEncuestaId;
                }
                catch { return 0; }
            }
        }

        [HttpDelete]
        [ActionName("BorraPreguntaEncuesta")]
        public string BorraPreguntaEncuesta(JObject jdata)
        {
            dynamic json = jdata;
            var a = json.EncuestaId;
            string EncuestaId = a.ToObject<string>();

            string Respuesta = "Error";
            try
            {

                if (DeleteEncuesta(Convert.ToInt32(EncuestaId)))
                {
                    Respuesta = "Correcto";
                }

            }
            catch (Exception e)
            {
                string b = e.ToString();
            }
            return Respuesta;

            bool DeleteEncuesta(int EncuestaId2)
            {
                try
                {
                    Encuesta objEncuesta = db.Encuesta.Where(doc => doc.EncuestaId == EncuestaId2).FirstOrDefault();
                    db.Encuesta.Remove(objEncuesta);
                    db.SaveChanges();
                    return true;
                }
                catch { return false; }
            }
        }
        #endregion
        #region Alumno
        [HttpGet]
        [ActionName("ObtenerPreguntas")]
        public List<DTO.DTOPreguntaN> ObtenerPreguntas(string NoControl, string MateriaId)
        {
            try
            {
                var objPeriodo = db.Periodo.Where(P =>
                                  DateTime.Now >= P.FechaInicio
                                  && DateTime.Now <= P.FechaFin).FirstOrDefault();

                var TipoCarAlumno = db.Alumno.Where(k => k.AlumnoId == NoControl)
                                    .FirstOrDefault()
                                    .AlumnoMateria
                                    .Where(k => k.MateriaId == MateriaId)
                                    .FirstOrDefault()
                                    .Carrera.
                                    TipoCarreraId;

                ///Codigo Pendiente
                var Config = db.ConfiguracionEncuesta
                                                                    .Where(k => k.PeriodoId == objPeriodo.PeriodoId
                                                                                && k.TipoCarreraId == TipoCarAlumno
                                                                                && (k.FechaInicio <= DateTime.Now
                                                                                    && k.FechaFin >= DateTime.Now)
                                                                                && k.Estatus == true)
                                                                    .FirstOrDefault();

                List<Pregunta> listPreguntasDocente = new List<Pregunta>();
                listPreguntasDocente = Config
                                        .Encuesta
                                        .ToList()
                                        .Select(K => K.Pregunta)
                                        .ToList();
                List<DTOPreguntaN> lstPreguntas = new List<DTOPreguntaN>();

                List<DTOPreguntaN> lstPr = db.Pregunta
                                            .Where(O => O.ConfiguracionPregunta.CategoriaId == 3)
                                            .Select(
                                                l => new DTOPreguntaN
                                                {
                                                    PreguntaId = l.PreguntaId,
                                                    CategoriaId = (int)l.ConfiguracionPregunta.CategoriaId,
                                                    CategoriaDescripcion = l.ConfiguracionPregunta.Categorias.Descripcion
                                                }).ToList();


                listPreguntasDocente = listPreguntasDocente.Where(o => o.ConfiguracionPregunta.CategoriaId == 3).ToList();

                listPreguntasDocente.ForEach(

                l =>
                {
                    lstPreguntas.Add(
                            new DTOPreguntaN
                            {
                                ConfiguracionEncuestaId = Config.ConfiguracionEncuestaId,
                                CategoriaId = Convert.ToInt32(l.ConfiguracionPregunta.CategoriaId),
                                ClaveOpcionId = Convert.ToInt32(l.ConfiguracionPregunta.ClaveOpcionId),
                                Descripcion = l.Descripcion,
                                PreguntaId = l.PreguntaId,
                                Opciones = db.OpcionPregunta
                                            .Where(lk => lk.ClaveOpcionId == l.ConfiguracionPregunta.ClaveOpcionId)
                                            .Select(kl => new DTOOpcionPregunta
                                            {
                                                ClaveOpcionId = kl.ClaveOpcionId,
                                                Descripcion = kl.Descripcion,
                                                OpcionPreguntaId = kl.OpcionPreguntaId
                                            })
                                            .ToList()
                            });
                });

                return lstPreguntas;
            }
            catch (Exception a)
            {
                return new List<DTOPreguntaN>() { new DTOPreguntaN
                {
                    ClaveOpcionId=-1,
                    Descripcion=a.Message,
                    PreguntaId=-1
                } };
            }
        }

        [HttpGet]
        public List<DTO.DTOPreguntaN> ObtenerPreguntasServicios(string NoControl, string ServicioId)
        {
            try
            {
                int CategoriaId = int.Parse(ServicioId);

                Periodo objPeriodo = db.Periodo.Where(P =>
                                    DateTime.Now >= P.FechaInicio
                                    && DateTime.Now <= P.FechaFin).FirstOrDefault();

                Alumno objAlumno = db.Alumno.Where(al => al.AlumnoId == NoControl).FirstOrDefault();

                int TipoCarrera = objAlumno.HistorialAlumno.FirstOrDefault().Carrera.TipoCarreraId;
                Carrera Carrera = objAlumno.HistorialAlumno.FirstOrDefault().Carrera;


               List<ConfiguracionEncuesta> Configuracion = db.ConfiguracionEncuesta
                                             .Where(p => p.PeriodoId == objPeriodo.PeriodoId
                                                     && p.TipoCarreraId == TipoCarrera
                                                     && (p.FechaInicio <= DateTime.Now
                                                        && p.FechaFin >= DateTime.Now)
                                                     && p.Estatus == true).ToList();
                var Pregunta = Configuracion.FirstOrDefault()
                                    .Encuesta.Select(E => E.Pregunta);


                List<DTOPreguntaN> lstPr = Pregunta.Where(P => P.ConfiguracionPregunta.CategoriaId == CategoriaId).Select(
                            l => new DTOPreguntaN
                            {
                                ConfiguracionEncuestaId = Configuracion.FirstOrDefault().ConfiguracionEncuestaId,
                                CategoriaId = Convert.ToInt32(l.ConfiguracionPregunta.CategoriaId),
                                ClaveOpcionId = Convert.ToInt32(l.ConfiguracionPregunta.ClaveOpcionId),
                                Descripcion = l.Descripcion,
                                PreguntaId = l.PreguntaId,
                                Opciones = db.OpcionPregunta
                                                .Where(lk => lk.ClaveOpcionId == l.ConfiguracionPregunta.ClaveOpcionId)
                                                .Select(kl => new DTOOpcionPregunta
                                                {
                                                    ClaveOpcionId = kl.ClaveOpcionId,
                                                    Descripcion = kl.Descripcion,
                                                    OpcionPreguntaId = kl.OpcionPreguntaId
                                                })
                                                .ToList()
                            }).ToList();
                return lstPr;
            }
            catch
            {
                return null;
            }
        }
        #endregion
    }
}