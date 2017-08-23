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
    public class MateriasController : ApiController
    {
        private IESEEntities db = new IESEEntities();

        [HttpGet]
        [ActionName("CargarMaterias")]
        public List<DTO.DTOMateria> CargarMaterias()
        {
            try
            {
                return db.Materia.Select(d => new DTOMateria
                {
                    Descripcion = d.Descripcion,
                    MateriaId = d.MateriaId
                }).ToList();
            }
            catch { return null; }
        }

        [HttpPost]
        [ActionName("GuardarMateria")]
        public bool GuardarMateria(JObject jdata)
        {
            dynamic json = jdata;
            var a = json.Descripcion;
            var b = json.MateriaId;
            string Descripcion = a.ToObject<string>(), 
                MateriaId = b.ToObject<string>();

            try
            {
                db.Materia.Add(new Materia
                {
                    Descripcion = Descripcion,
                    MateriaId = MateriaId
                });

                db.SaveChanges();
                return true;
            }
            catch
            { return false; }
        }
        [HttpPost]
        [ActionName("TraerDocentesM")]
        public List<DTO.DTODocenteMateria> TraerDocentesM(JObject jdata)
        {
            dynamic json = jdata;
            var a2 = json.MateriaId;
            string MateriaId = a2.ToObject<string>();

            try
            {
                return (from a in db.DocenteMateria
                        where a.MateriaId == MateriaId
                        select new DTODocenteMateria
                        {
                            Carrera = a.Carrera.Descripcion,
                            DocenteId = a.DocenteId,
                            Nombre = a.Docente.Nombre + " " + a.Docente.Paterno + " " + a.Docente.Materno,
                            Periodo = a.Periodo.Descripcion,
                            Sabatino = a.EsSabatino == true ? "SI" : "No",
                            Usuario = a.Usuario.Nombre
                        }).ToList();
            }
            catch
            { return null; }
        }

        [HttpPut]
        [ActionName("GuardarTodas")]
        public List<DTO.DTOMateria> GuardarTodas(JObject jdata)
        {
            dynamic json = jdata;
            List<DTO.DTOMateria> Materias = new List<DTO.DTOMateria>();
            string UsuarioId;
            var a = json.Materias;
            var b = json.UsuarioId;
            foreach(JObject j in a)
            {
                DTO.DTOMateria objm = j.ToObject<DTO.DTOMateria>();
                Materias.Add(objm);
            }
            UsuarioId = b.ToObject<string>();

            List<DTOMateria> lst2 = new List<DTOMateria>();
            try
            {
                List<Materia> lstGuardar = new List<Materia>();
                Materias.ForEach(o =>
                {
                    if (db.Materia.Where(l => l.MateriaId == o.MateriaId).ToList().Count == 0)
                    {
                        db.Materia.Add(new Materia
                        {
                            MateriaId = o.MateriaId,
                            Descripcion = o.Descripcion,
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

        [HttpPut]
        [ActionName("GuardarDocenteMateria")]
        public bool GuardarDocenteMateria(JObject jData)
        {
            dynamic json = jData;
            var a = json.Materia;
            DTO.DTODocenteMateriaDB ojbMat = a.ToObject<DTO.DTODocenteMateriaDB>();

            try
            {
                db.DocenteMateria.Add(new DocenteMateria
                {
                    CarreraId = ojbMat.CarreraId,
                    DocenteId = ojbMat.DocenteId,
                    EsSabatino = ojbMat.EsSabatino,
                    MateriaId = ojbMat.MateriaId,
                    PeriodoId = ojbMat.PeriodoId,
                    UsuarioId = ojbMat.UsuarioId
                });
                db.SaveChanges();
                return true;
            }
            catch { return false; }
        }

        [HttpPost]
        [ActionName("TraerMateriasCarrera")]
        public List<DTO.DTOMateria> TraerMateriasCarrera(JObject jdata)
        {
            dynamic json = jdata;
            var a = json.CarreraId;
            string CarreraId = a.ToObject<string>();

            int carrera2 = int.Parse(CarreraId);
            try
            {
                return db.Materia.Where(k => k.CarreraId == carrera2)
                            .Select(j => new DTOMateria
                            {
                                Descripcion = j.Descripcion,
                                MateriaId = j.MateriaId
                            }).ToList();
            }
            catch
            { return null; }
        }
    }
}