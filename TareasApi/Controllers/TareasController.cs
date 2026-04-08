using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TareasApi.Data;
using TareasApi.Models;

namespace TareasApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TareasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TareasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tarea>>> Get()
        {
            return await _context.Tareas
                .Where(t => t.Activa)
                .OrderBy(t => t.Id)
                .ToListAsync();
        }

        [HttpGet("completadas")]
        public async Task<ActionResult<IEnumerable<Tarea>>> GetCompletadas()
        {
            return await _context.Tareas
                .Where(t => t.Activa && t.Completada)
                .OrderBy(t => t.Id)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Tarea>> Post(Tarea tarea)
        {
            _context.Tareas.Add(tarea);
            await _context.SaveChangesAsync();
            return tarea;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Tarea tarea)
        {
            if (id != tarea.Id) return BadRequest();

            _context.Entry(tarea).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tarea = await _context.Tareas.FindAsync(id);
            if (tarea == null) return NotFound();

            tarea.Activa = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}