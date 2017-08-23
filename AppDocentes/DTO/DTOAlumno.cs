using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTOAlumno
    {
        public string AlumnoId { get; set; }
        public string Nombre { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string EsSabatino { get; set; }
        public string key { get; set; }
        public string Pass { get; set; }
        public string UsuarioId { get; set; }
    }
    public class TestAlumno
    {
        public string AlumnoId { get; set; }
        public string Periodo { get; set; }
        public string Carrera { get; set; }
        public string Docente { get; set; }
        public int ServicioId { get; set; }
        public string Comentario { get; set; }
        public string Sabatino { get; set; }
        public string MateriaId { get; set; }
        public List<TestPregunta> Preguntas { get; set; }
    }
    public class TestPregunta
    {
        public string PreguntaId { get; set; }
        public string Respuesta { get; set; }
        public int ConfiguracionEncuestaId { get; set; }
    }
}
