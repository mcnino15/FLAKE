import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorService } from '../../services/tutor.service';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Tutor } from '../../model/tutor.model';
import { MessageService, SelectItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tutor-manager',
  standalone: true,
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
  templateUrl: './tutor-manager.component.html',
  styleUrls: ['./tutor-manager.component.css'],
  providers: [MessageService, TutorService],
})
export class TutorManagerComponent implements OnInit {
  tutores: Tutor[] = [];
  private messageService = inject(MessageService);
  private tutorService = inject(TutorService);
  clonedProducts: { [s: string]: Tutor } = {};
  constructor() {}
  nuevoTutor: Tutor = {
    idtutor: 0,
    persona: {
      id: 0,
      password: '',
      last_login: null,
      is_superuser: false,
      cedula: '',
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      genero: '',
      fecha_nacimiento: new Date(),
      estrato: '',
      is_active: true,
      is_staff: false,
      groups: [],
      user_permissions: [],
    },
    telefono: '',
    correo: '',
    direccion: '',
    instituciones: 0,
    aula: 0,
  };

  mostrarFormulario = false;

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  ngOnInit(): void {
    this.tutorService.getTutores().subscribe((data) => {
      this.tutores = data;
    });
  }
  crearTutor(): void {
    console.log(JSON.stringify(this.nuevoTutor));
    this.tutorService.createTutor(this.nuevoTutor).subscribe(
      (data) => {
        console.log('Tutor creado:', data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tutor creado exitosamente',
        });
        this.tutores.push(data);
        this.nuevoTutor = {
          idtutor: 0,
          persona: {
            id: 0,
            password: '',
            last_login: null,
            is_superuser: false,
            cedula: '',
            primer_nombre: '',
            segundo_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            genero: '',
            fecha_nacimiento: new Date(),
            estrato: '',
            is_active: true,
            is_staff: false,
            groups: [],
            user_permissions: [],
          },
          telefono: '',
          correo: '',
          direccion: '',
          instituciones: 0,
          aula: 0,
        };
        this.mostrarFormulario = false; // Ocultar el formulario después de crear el tutor
      },
      (error) => {
        console.error('Error al crear el tutor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el tutor',
        });
      }
    );
  }

  onRowEditInit(tutor: Tutor) {
    this.clonedProducts[tutor.idtutor] = { ...tutor };
  }

  onRowEditSave(tutor: Tutor) {
    console.log('Datos enviados para actualizar:', tutor);
    this.tutorService.updateTutor(tutor).subscribe(
      (response) => {
        // Manejar la respuesta exitosa
        console.log('Tutor actualizado', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Table is updated',
        });
        delete this.clonedProducts[tutor.idtutor as number];
      },
      (error) => {
        // Manejar el error
        console.error('Error al actualizar el tutor', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el tutor',
        });
      }
    );
  }

  onRowEditCancel(tutor: Tutor, index: number) {
    this.tutores[index] = this.clonedProducts[tutor.idtutor as number];
    delete this.clonedProducts[tutor.idtutor as number];
  }

  onRowEditDelete(tutor: Tutor, index: number) {
    this.tutorService.deleteTutor(tutor).subscribe(
      (response) => {
        console.log('Tutor eliminado', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tutor eliminado',
        });
        this.tutores.splice(index, 1);
      },
      (error) => {
        console.error('Error al eliminar el tutor', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el tutor',
        });
      }
    );
  }
}
