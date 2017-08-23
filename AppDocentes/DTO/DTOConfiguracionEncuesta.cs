using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTOConfiguracionEncuesta
    {
        public int ConfiguracionEncuestaId { get; set; }
        public int PeriodoId { get; set; }
        public int TipoCarreraId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public bool Estatus { get; set; }
        public int UsuarioModifico { get; set; }
        public DateTime FechaModificacion { get; set; }
    }
    public class DTOConfiguracionAll
    {
        public int ConfiguracionEncuestaId { get; set; }
        public string DescripcionPeriodo { get; set; }
        public string DescripcionTipoCarrera { get; set; } 
        public string FechaInicio { get; set; }
        public string FechaFin { get; set; }
        public string Estatus { get; set; }
        public int ConfiguracionEncuestaIdC { get; set; }
        public int PeriodoId { get; set; }

    }
     
}
