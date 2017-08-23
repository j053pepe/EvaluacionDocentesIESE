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
    public class CarreraController : ApiController
    {
        private IESEEntities db = new IESEEntities();

        [HttpGet]
        [ActionName("TraerCarreras")]
        public List<DTO.DTOCarrera> TraerCarreras()
        {
            try
            {
                return (from a in db.Carrera
                        select new DTOCarrera
                        {
                            CarreraId = a.CarreraId,
                            Descripcion = a.Descripcion
                        }).ToList();
            }
            catch
            {
                return null;
            }
        }
    }
}