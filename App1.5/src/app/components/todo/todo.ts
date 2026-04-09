import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TareasService } from '../../services/tareas.service';
import { Tarea } from '../../models/tarea.model';
import { firstValueFrom } from 'rxjs';
import { TodoListComponent } from '../todo-list/todo-list';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true, 
  imports: [CommonModule, RouterModule, TodoListComponent, FormsModule],              //CHERRY CHERRY
  templateUrl: './todo.html',
})
export class TodoComponent implements OnInit {                             

  tareas = signal<Tarea[]>([]);
  esVistaCompletadas = false;               
  nomb = "*****";                                                       //Prueba Revert

  mensaje = '';
  tipoMensaje: 'success' | 'error' | 'info' = 'info';                        //Prueba Reset

  textoBusqueda: string = '';

  constructor(
    private tareasService: TareasService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const url = this.router.url;

    this.esVistaCompletadas = url.includes('completadas');

    if (isPlatformBrowser(this.platformId)) {
      const msg = sessionStorage.getItem('mensaje');
      if (msg) {
        this.mensaje = msg;
        this.tipoMensaje = 'success';
        setTimeout(() => this.mensaje = '', 5000);      //ARREGLAR TIEMPO
        sessionStorage.removeItem('mensaje');
      }
    }

    this.cargarTareas();
  }

  async cargarTareas() {
    try {
      let data;

      if (this.esVistaCompletadas) {
        data = await firstValueFrom(this.tareasService.obtenerCompletadas());
      } else {
        data = await firstValueFrom(this.tareasService.obtenerTareas());
      }

      this.tareas.set(data);

    } catch (error) {
      this.tareas.set([]);
      this.mensaje = 'Error al cargar tareas';
      this.tipoMensaje = 'error';
    }
  }

  async eliminarTarea(id: number) {
    try {
      await firstValueFrom(this.tareasService.eliminarTarea(id));

      this.tareas.update(t => t.filter(t => t.id !== id));

      this.mensaje = 'Tarea eliminada correctamente';
      this.tipoMensaje = 'success';

    } catch (error) {
      this.mensaje = 'Error al eliminar la tarea';
      this.tipoMensaje = 'error';
    }

    setTimeout(() => this.mensaje = '', 5000);     //ARREGLAR TIEMPO
  }

  async marcarComoHecho(tarea: Tarea) { 
    const tareaActualizada = {
      ...tarea,
      completada: !tarea.completada
    };

    try {
      await firstValueFrom(this.tareasService.actualizarTarea(tareaActualizada));

      this.tareas.update(lista =>
        lista.map(t => t.id === tarea.id ? tareaActualizada : t)
      );

      this.mensaje = tareaActualizada.completada
        ? 'Tarea completada'
        : 'Tarea desmarcada';

      this.tipoMensaje = 'success';

    } catch (error) {
      this.mensaje = 'Error al actualizar tarea';
      this.tipoMensaje = 'error';
    }
  
    setTimeout(() => this.mensaje = '', 5000);        //ARREGLAR TIEMPO
  }

  editarTarea(tarea: Tarea) {
    this.router.navigate(['/editar', tarea.id]);
  }

  volver() {
    this.router.navigate(['/']);
  }

  get tareasFiltradas(): Tarea[] {
    return this.tareas()
      .filter(t =>
        t.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        t.descripcion.toLowerCase().includes(this.textoBusqueda.toLowerCase())
      );
  }
}