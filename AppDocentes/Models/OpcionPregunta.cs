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
    
    public partial class OpcionPregunta
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public OpcionPregunta()
        {
            this.PreguntaDocente = new HashSet<PreguntaDocente>();
            this.PreguntaServicios = new HashSet<PreguntaServicios>();
        }
    
        public int OpcionPreguntaId { get; set; }
        public int ClaveOpcionId { get; set; }
        public string Descripcion { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PreguntaDocente> PreguntaDocente { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PreguntaServicios> PreguntaServicios { get; set; }
    }
}
