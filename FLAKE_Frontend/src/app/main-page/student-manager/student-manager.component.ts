import { Estudiante, EstudianteCrear } from './../../model/estudiante.model';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SelectItem } from 'primeng/api';
import { EstudiantesService } from '../../services/estudiantes.service';


@Component({
  selector: 'app-student-manager',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToastModule,
    TagModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './student-manager.component.html',
  styleUrls: ['./student-manager.component.css'],
  providers: [MessageService, EstudiantesService],
})
export class StudentManagerComponent {
  estudiantes: Estudiante[] = [];
  private messageService = inject(MessageService);
  private estudiantesService = inject(EstudiantesService);

  clonedProducts: { [s: string]: Estudiante } = {};

  nuevostudent: EstudianteCrear = {
  cedula: "" ,
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido:"",
  segundo_apellido: "",
  genero: "",
  fecha_nacimiento: new Date(),
  estrato:  "",
  password: "",
  instituciones: 1,
  aula: 1
    
  };

  mostrarFormulario = false;

  ngOnInit(): void {
    this.estudiantesService.getEstudiantes().subscribe((data) => {
      this.estudiantes = data;
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  onRowEditInit(estudiante: Estudiante) {
    this.clonedProducts[estudiante.idestudiante] = { ...estudiante };
  }

  onRowEditSave(estudiante: Estudiante) {
    console.log('Datos enviados para actualizar:', estudiante);
    this.estudiantesService.updateEstudiante(estudiante).subscribe(
      (response) => {
        // Manejar la respuesta exitosa
        console.log('Estudiante actualizado', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Table is updated',
        });
        delete this.clonedProducts[estudiante.idestudiante as number];
      },
      (error) => {
        console.error('Error al actualizar el estudiante', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el estudiante',
        });
      }
    );
  }

  onRowEditCancel(estudiante: Estudiante, index: number) {
    this.estudiantes[index] =
      this.clonedProducts[estudiante.idestudiante as number];
    delete this.clonedProducts[estudiante.idestudiante as number];
  }

  onRowEditDelete(estudiante: Estudiante, index: number) {
    this.estudiantesService.deleteEstudiante(estudiante).subscribe(
      (response) => {
        console.log('Estudiante eliminado', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Estudiante eliminado',
        });
        this.estudiantes.splice(index, 1);
      },
      (error) => {
        console.error('Error al eliminar el estudiante', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el estudiante',
        });
      }
    );
  }

  crearEstudiante(): void {
    this.estudiantesService.crearEstudiante(this.nuevostudent).subscribe(
      (data) => {
        console.log('Estudiante creado:', data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tutor creado exitosamente',
        });
        this.estudiantes.push(data);
        this.nuevostudent =  {
          cedula: "" ,
          primer_nombre: "",
          segundo_nombre: "",
          primer_apellido:"",
          segundo_apellido: "",
          genero: "",
          fecha_nacimiento: new Date(),
          estrato:  "",
          password: "",
          instituciones: 1,
          aula: 1
            
          };
        this.mostrarFormulario = false;
      },
      (error) => {
        console.error('Error al crear el estudiante:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el estudiante',
        });
      }
    );
  }
}
