using AppDocentes.Models;
using DTO;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Services.Controllers
{
    public class PeriodoController : ApiController
    {
        private IESEEntities db = new IESEEntities();

        [HttpGet]
        [ActionName("TraerPeriodos")]
        public List<DTO.DTOPeriodo> TraerPeriodos()
        {
            try
            {
                return (from a in db.Periodo
                        select new DTOPeriodo
                        {
                            Descripcion = a.Descripcion,
                            PeriodoId = a.PeriodoId
                        }).ToList();
            }
            catch
            {
                return null;
            }
        }

        [HttpPut]
        [ActionName("AgregaPeriodo")]
        public string AgregaPeriodo(JObject jdata)
        {
            dynamic json = jdata;
            string MesInicio, MesFin, AnioInicio, AnioFin, UsuarioId;
            var a1 = json.MesInicio;
            MesInicio = a1.ToObject<string>();
            var b = json.MesFin;
            MesFin = b.ToObject<string>();
            var c = json.AnioInicio;
            AnioInicio = c.ToObject<string>();
            var d = json.AnioFin;
            AnioFin = d.ToObject<string>();
            var e = json.UsuarioId;
            UsuarioId = e.ToObject<string>();

            string Respuesta = "Error, consulte a su administrador.";

            CultureInfo culture = CultureInfo.CreateSpecificCulture("es-MX");

            DateTime fechatemp;
            DateTime fechaInicio;
            DateTime fechaFin;

            //tomamos la fecha del primer dia del fin del periodo
            fechatemp = DateTime.ParseExact("01/" + RetornaMes(MesFin) + "/" + AnioFin, "dd/MM/yyyy", CultureInfo.InvariantCulture);

            //fechatemp = new DateTime(Convert.ToInt32(AnioFin),RetornaMes(MesFin), 1);

            fechaInicio = DateTime.ParseExact("01/" + RetornaMes(MesInicio) + "/" + AnioInicio, "dd/MM/yyyy", CultureInfo.InvariantCulture);
            //new DateTime(Convert.ToInt32(AnioInicio),RetornaMes(MesInicio), 1);
            fechaFin = fechatemp.AddMonths(1).AddDays(-1);



            try
            {

                DTO.DTOPeriodo bllPer = new DTO.DTOPeriodo();
                bllPer = db.Periodo.Where(I => I.Descripcion == (MesInicio + " " + AnioInicio + " - " + MesFin + " " + AnioFin))
                    .Select(d2 => new DTOPeriodo
                    {
                        PeriodoId = d2.PeriodoId,
                        Descripcion = d2.Descripcion
                    }).FirstOrDefault();

                if (bllPer != null && bllPer.PeriodoId > 0)
                {
                    return "Periodo ya existe";
                }
                bllPer = new DTO.DTOPeriodo();
                if (MesInicio == "Agosto" && MesFin == "Enero")
                {
                    if (Convert.ToInt32(AnioFin) - Convert.ToInt32(AnioInicio) == 1)
                    {
                        bllPer.Descripcion = MesInicio + " " + AnioInicio + " - " + MesFin + " " + AnioFin;
                        bllPer.PeriodoId = 0;
                        bllPer.FechaInicio = fechaInicio;
                        bllPer.FechaFin = fechaFin;
                        bllPer.UsuarioId = Convert.ToInt32(UsuarioId);
                        try
                        {
                            db.Periodo.Add(new Periodo
                            {
                                //PeriodoId = Periodo.PeriodoId,
                                Descripcion = bllPer.Descripcion,
                                UsuarioId = bllPer.UsuarioId,
                                FechaInicio = bllPer.FechaInicio,
                                FechaFin = bllPer.FechaFin

                            });
                            db.SaveChanges();
                            Respuesta = "El periodo se agrego correctamente.";
                        }
                        catch
                        {                        }
                        
                    }
                    else
                    {
                        Respuesta = "Periodo invalido, seleccione un periodo valido.";
                    }
                }
                else if (MesInicio == "Febrero" && MesFin == "Julio")
                {
                    if (Convert.ToInt32(AnioFin) - Convert.ToInt32(AnioInicio) == 0)
                    {
                        bllPer.Descripcion = MesInicio + " " + AnioInicio + " - " + MesFin + " " + AnioFin;
                        bllPer.PeriodoId = 0;
                        bllPer.FechaInicio = fechaInicio;
                        bllPer.FechaFin = fechaFin;
                        bllPer.UsuarioId = Convert.ToInt32(UsuarioId);

                        try
                        {
                            db.Periodo.Add(new Periodo
                            {
                                //PeriodoId = Periodo.PeriodoId,
                                Descripcion = bllPer.Descripcion,
                                UsuarioId = bllPer.UsuarioId,
                                FechaInicio = bllPer.FechaInicio,
                                FechaFin = bllPer.FechaFin

                            });
                            db.SaveChanges();
                            Respuesta = "El periodo se agrego correctamente.";
                        }
                        catch
                        {
                        }
                        


                    }
                    else
                    {
                        Respuesta = "Periodo invalido, seleccione un periodo valido.";
                    }
                }
                else
                {
                    Respuesta = "Periodo invalido, seleccione un periodo valido.";
                }
            }
            catch (Exception a)
            {
                string ad = a.Message;

            }

            return Respuesta;
        }

        [HttpDelete]
        [ActionName("BorrarPeriodo")]
        public string BorrarPeriodo(JObject jdata)
        {
            dynamic json = jdata;
            var a = json.PeriodoId;
            string PeriodoId = a.ToObject<string>();
            string Respuesta = "Error";
            int PeriodoId2 = int.Parse(PeriodoId);
            try
            {
                Periodo objPeriodo = db.Periodo.Where(doc => doc.PeriodoId == PeriodoId2).FirstOrDefault();
                db.Periodo.Remove(objPeriodo);
                db.SaveChanges();
                Respuesta = "Correcto";
            }
            catch { }
            return Respuesta;

        }

        private string RetornaMes(string Mes)
        {
            string mes = "00";
            switch (Mes.ToUpper())
            {
                case "ENERO":
                    mes = "01";
                    break;
                case "FEBRERO":
                    mes = "02";
                    break;
                case "JULIO":
                    mes = "07";
                    break;
                case "AGOSTO":
                    mes = "08";
                    break;
            }

            return mes;


        }
    }
}