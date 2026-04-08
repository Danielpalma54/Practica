namespace TareasApi.Models
{
    public class Tarea
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = "";
        public string Descripcion { get; set; } = "";
        public string Fecha { get; set; } = "";
        public bool Completada { get; set; }
        public string? Imagen { get; set; }
        public bool Activa { get; set; } = true; //respaldo en caso de borrado solo se vuelve inactiva //IMPORTANTE HACER MIGRACIONES Y UPDATE  TAMBIEN VERIFICAR EN DBEAVER
    }
}