import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-list.html'
})
export class TodoListComponent {
 
  @Input() tareas: Tarea[] = [];    //Recibe los datos 
  @Input() soloVista: boolean = false;

  @Output() eliminar = new EventEmitter<number>();   //Envia eventos
  @Output() toggle = new EventEmitter<Tarea>();
  @Output() editar = new EventEmitter<Tarea>();
}