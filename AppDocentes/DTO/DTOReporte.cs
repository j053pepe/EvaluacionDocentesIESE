using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class DTOReporteG
    {
       public List<DTOReporte> lstRespuestas { get; set; }
        public List<DTOReporteG> lstCometarios { get; set; }
    }
    public class DTOReporte
    {
        public int PeriodoId { get; set; }
        public int CarreraId { get; set; }
        public int PreguntaId { get; set; }
        public string PreguntaDescripcion { get; set; }
        public string MateriaId { get; set; }
        public bool EsSabatino { get; set; }
        public int[] clavesOpcion { get; set; }
        public List<DTOOpcionesR> Opciones { get; set; }
    }
    public class DTOReporteComentarios
    {
        public int ComentarioId { get; set; }
        public string Comentario { get; set; }
    }
    public class DTOOpcionesR
    {
        public int OpcionPreguntaId { get; set; }
        public string Descripcion { get; set; }
        public int TotalA { get; set; }
    }
    public class DTODocenteReporte
    {
        public int DocenteId { get; set; }
        public string Nombre { get; set; }
        public string ImgDocente { get; set; }       
        public List<DTOSistemaR> Sistema { get; set; }
        //public List<List<DTOReporte>> Preguntas { get; set; }
    }
    public class DTOSistemaR
    {
        public int SistemaId { get; set; }
        public string Descripcion { get; set; }
        public List<DTOPeriodosR> Periodos { get; set; }
    }
    public class DTOPeriodosR
    {
        public int PeriodoId { get; set; }
        public string Descripcion { get; set; }
        public List<DTOCarrerasR> Carreras { get; set; }
    }
    public class DTOCarrerasR
    {
        public int CarreraId { get; set; }
        public string Descripcion { get; set; }
        public List<DTOMateriasR> Materias { get; set; }
    }
    public class DTOMateriasR
    {
        public string MateriaId { get; set; }
        public string Descripcion { get; set; }

    }
}
