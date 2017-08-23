using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTOServicios
    {
        public int AlumnoId { get; set; }
        public int ServicioId { get; set; }
        public string Descripcion { get; set; }
        public int PeriodoId { get; set; }
        public string PeriodoS { get; set; }
        public int CarreraId { get; set; }
        public string Carrera { get; set; }
        public bool Sabatino { get; set; }
    }
}
