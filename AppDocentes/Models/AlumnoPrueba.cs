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
    
    public partial class AlumnoPrueba
    {
        public string AlumnoId { get; set; }
        public int PeriodoId { get; set; }
        public int CarreraId { get; set; }
        public System.DateTime FechaAplicacion { get; set; }
        public bool Estatus { get; set; }
    
        public virtual Alumno Alumno { get; set; }
        public virtual Carrera Carrera { get; set; }
        public virtual Periodo Periodo { get; set; }
    }
}