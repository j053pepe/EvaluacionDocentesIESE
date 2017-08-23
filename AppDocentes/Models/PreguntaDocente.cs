//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AppDocentes.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class PreguntaDocente
    {
        public int PreguntaDocenteId { get; set; }
        public int ConfiguracionEncuestaId { get; set; }
        public int DocenteId { get; set; }
        public int PeriodoId { get; set; }
        public int CarreraId { get; set; }
        public string MateriaId { get; set; }
        public System.DateTime FechaAplicacion { get; set; }
        public int PreguntaId { get; set; }
        public int OpcionPreguntaId { get; set; }
        public bool EsSabatino { get; set; }
    
        public virtual Carrera Carrera { get; set; }
        public virtual ConfiguracionEncuesta ConfiguracionEncuesta { get; set; }
        public virtual Docente Docente { get; set; }
        public virtual Materia Materia { get; set; }
        public virtual OpcionPregunta OpcionPregunta { get; set; }
        public virtual Periodo Periodo { get; set; }
        public virtual Pregunta Pregunta { get; set; }
    }
}
