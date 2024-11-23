import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AulaService } from '../../services/aula.service';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Aula } from '../../model/aula.model';
import { MessageService, SelectItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aulas-manager',
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
  templateUrl: './aulas-manager.component.html',
  styleUrls: ['./aulas-manager.component.css'],
  providers: [MessageService, AulaService],
})
export class AulasManagerComponent implements OnInit {
  aulas: Aula[] = [];
  private messageService = inject(MessageService);
  private aulaService = inject(AulaService);

  clonedProducts: { [s: string]: Aula } = {};
  nuevoAula: Aula = {
    idaula: 0,
    institucion: 0,
    grado: '',
    gradunum: 0,
    grupo: 0,
    jornada: 'string',
  };
  mostrarFormulario = false;

  constructor() {}

  ngOnInit(): void {
    this.aulaService.getAulas().subscribe((data) => {
      this.aulas = data;
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  crearAula(): void {
    this.aulaService.createAula(this.nuevoAula).subscribe(
      (data) => {
        console.log('Aula creada:', data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Aula creada exitosamente',
        });
        this.aulas.push(data);
        this.nuevoAula = {
          idaula: 0,
          institucion: 0,
          grado: '',
          gradunum: 0,
          grupo: 0,
          jornada: '',
        };
        this.mostrarFormulario = false; // Ocultar el formulario después de crear el aula
      },
      (error) => {
        console.error('Error al crear el aula:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el aula',
        });
      }
    );
  }

  onRowEditInit(aula: Aula) {
    this.clonedProducts[aula.idaula as number] = { ...aula };
  }
  onRowEditSave(aula: Aula) {
    console.log('Datos enviados para actualizar:', aula);
    this.aulaService.updateAula(aula).subscribe(
      (response) => {
        // Manejar la respuesta exitosa
        console.log('Aula actualizada', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Table is updated',
        });
        delete this.clonedProducts[aula.idaula as number];
      },
      (error) => {
        // Manejar el error
        console.error('Error al actualizar el aula', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el tutor',
        });
      }
    );
  }

  onRowEditCancel(aula: Aula, index: number) {
    this.aulas[index] = this.clonedProducts[aula.idaula as number];
    delete this.clonedProducts[aula.idaula as number];
  }
  onRowEditDelete(aula: Aula, index: number) {
    this.aulaService.deleteAula(aula).subscribe(
      (data) => {
        console.log('Aulaeliminada', data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Aula eliminada',
        });
        this.aulas.splice(index, 1);
      },
      (error) => {
        console.error('Error al eliminar el aula', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el aula',
        });
      }
    );
  }
}
