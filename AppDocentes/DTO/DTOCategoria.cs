using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTOCategoria
    {
        public int CategoriaId { get; set; }
        public string Descripcion { get; set; }
        public int?  UsuarioId { get; set; }
    }
}
