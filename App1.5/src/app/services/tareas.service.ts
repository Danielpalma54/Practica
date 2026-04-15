import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tarea } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private API = 'http://localhost:5000/api/tareas';

  constructor(private http: HttpClient) {}

  obtenerTareas() {
    return this.http.get<Tarea[]>(this.API);
  }

  obtenerCompletadas() {
    return this.http.get<Tarea[]>(`${this.API}/completadas`);
  }

  agregarTarea(tarea: Tarea) {
    return this.http.post<Tarea>(this.API, tarea);
  }

  actualizarTarea(tarea: Tarea) {
    return this.http.put<Tarea>(`${this.API}/${tarea.id}`, tarea);
  }

  eliminarTarea(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
