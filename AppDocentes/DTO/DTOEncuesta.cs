using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTOEncuesta
    {
        public int EncuestaId { get; set; }
        public int ConfiguracionEncuestaId { get; set; }
        public int PreguntaId { get; set; }
        public int Estatus { get; set; }
        public DateTime FechaModificacion { get; set; }
        public int UsuarioModifico { get; set; } 
    }

}
