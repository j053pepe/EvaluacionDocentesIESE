using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTOGrupo
    {
        public List<DTOGrupoAlumnos> lstAlumnosDocenteMateria { get; set; }
        public List<DTOGrupoAlumnos> lstAlumnosLibres { get; set; }
    }
    public class DTOGrupoAlumnos
    {
        public string NumeroAlumno { get; set; }
        public string Nombre { get; set; }
        public int CarreraId { get; set; }
        public string CarreraS { get; set; }
        public bool Estatus { get; set; }
    }
}
