using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTODocente
    {
        public int DocenteId { get; set; }
        public string Nombre { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string RutaFoto { get; set; }
        public Bitmap Foto { get; set; } 
    }

    public class DTODocenteMateria
    {
        public int DocenteId { get; set; }
        public string Nombre { get; set; }
        public string Carrera { get; set; }
        public string Periodo { get; set; }
        public string Sabatino { get; set; }
        public string Usuario { get; set; }
    }
    public class DTODocenteMateriaDB
    {
        public int DocenteMateriaId { get; set; }
        public int CarreraId { get; set; }
        public string CarreraS { get; set; }
        public int PeriodoId { get; set; }
        public string PeriodoS { get; set; }
        public int DocenteId { get; set; }
        public string NombreDocente { get; set; }
        public string MateriaId { get; set; }
        public string MateriaS { get; set; }
        public bool EsSabatino { get; set; }
        public int UsuarioId { get; set; }
        public string UsuarioS { get; set; }
        public string RutaFoto { get; set; }
        public int AlumnoMateriaId { get; set; }
    }
}
