using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTOUsuario
    {
        public int UsuarioId { get; set; }
        public string NombreUser { get; set; }
        public string Password { get; set; }
        public string Key { get; set; }
        public string Nombre { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Email { get; set; } 
    }
}
