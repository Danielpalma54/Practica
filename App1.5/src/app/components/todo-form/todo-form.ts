import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TareasService } from '../../services/tareas.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.html'
})
export class TodoFormComponent implements OnInit {

  formTarea = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$')]), //Validacion del formulario q
    descripcion: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  imagenBase64: string = ''; 
  editando = false;
  tareaId: number | null = null;
  estadoActual = false;

  constructor(
    private tareasService: TareasService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editando = true;
      this.tareaId = Number(id);

      const tareas = await firstValueFrom(this.tareasService.obtenerTareas());
      const tarea = tareas.find(t => t.id === this.tareaId);

      if (tarea) {
        this.formTarea.setValue({
          nombre: tarea.nombre,
          descripcion: tarea.descripcion
        });

        this.estadoActual = tarea.completada;
        if (tarea.imagen) {
          this.imagenBase64 = tarea.imagen;
        }
      }
    }
  }

  onFileSelected(event: any) { //Funcion de seleccionar archivo
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  async guardar() {
    if (this.formTarea.invalid) {
      this.formTarea.markAllAsTouched();  //muestra el mensaje de error del formulario
      return;
    }

    const fechaActual = new Date().toISOString().split('T')[0];

    if (this.editando && this.tareaId !== null) {
      await firstValueFrom(this.tareasService.actualizarTarea({
        id: this.tareaId,
        nombre: this.formTarea.value.nombre!,
        descripcion: this.formTarea.value.descripcion!,
        fecha: fechaActual,
        completada: this.estadoActual,
        imagen: this.imagenBase64  
      }));

      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem('mensaje', 'Tarea actualizada correctamente');
      }

    } else {
      await firstValueFrom(this.tareasService.agregarTarea({
        nombre: this.formTarea.value.nombre!,
        descripcion: this.formTarea.value.descripcion!,
        fecha: fechaActual,                        
        completada: false,             //Nueva tarea sin terminar, siempre
        imagen: this.imagenBase64 
      }));

      if (isPlatformBrowser(this.platformId)) {            
        sessionStorage.setItem('mensaje', 'Tarea agregada correctamente');
      }
    }

    this.router.navigate(['/']);
  }
}