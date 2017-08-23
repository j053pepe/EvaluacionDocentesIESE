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
    public class SemestreController : ApiController
    {
        private IESEEntities db = new IESEEntities();

        [HttpGet]
        public List<DTO.DTOSemestre> TraerSemestres()
        {
            try
            {
                return (from a in db.Semestre
                        select new DTOSemestre
                        {
                            Descripcion = a.Descripcion,
                            SemestreId = a.SemestreId
                        }).ToList();
            }
            catch
            {
                return null;
            }
        }
    }
}