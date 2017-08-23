using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTOPregunta
    {
        public int PreguntaId { get; set; }
        public string Descripcion { get; set; }
        public int ClaveOpcionId { get; set; }
        public int UsuarioId { get; set; }
        public int CategoriaId { get; set; }
        public int TipoCarreraId { get; set; }
        public bool Estatus { get; set; }
    }

    public class DTOPreguntaBD
    {
        public int PreguntaId { get; set; }
        public string Descripcion { get; set; }
        public int UsuarioId { get; set; }
        public bool Estatus { get; set; }
    }

    public class DTOPreguntaN
    {
        public int PreguntaId { get; set; }
        public int ConfiguracionEncuestaId { get; set; }
        public string Descripcion { get; set; }
        public int ClaveOpcionId { get; set; }
        public int CategoriaId { get; set; }
        public string CategoriaDescripcion { get; set; }
        public List<DTOOpcionPregunta> Opciones { get; set; }
    }

    public class DTOPreguntaAll
    {
        public int PreguntaId { get; set; }
        public string Descripcion { get; set; }
        public int CategoriaId { get; set; }
        public string CategoriaDescripcion { get; set; }
        public int EncuestaId { get; set; }

    }
}
