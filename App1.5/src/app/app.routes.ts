import { Routes } from '@angular/router';
import { TodoComponent } from './components/todo/todo';
import { TodoFormComponent } from './components/todo-form/todo-form';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', component: TodoComponent },
  { path: 'nueva', component: TodoFormComponent },
  { path: 'editar/:id', component: TodoFormComponent },
  { path: 'completadas', component: TodoComponent },
  { path: '**', component: NotFound }
];
