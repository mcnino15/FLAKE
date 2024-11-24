import { Component, inject } from '@angular/core';
import { Institucion } from '../../model/institucion.model';
import { InstitucionService } from '../../services/institucion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SelectItem } from 'primeng/api';

@Component({
  selector: 'app-institution-manager',
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
  templateUrl: './institution-manager.component.html',
  styleUrl: './institution-manager.component.css',
  providers: [MessageService, InstitucionService],
})
export class InstitutionManagerComponent {
  instituciones: Institucion[] = [];
  private messageService = inject(MessageService);
  private institucionService = inject(InstitucionService);
  clonedProducts: { [s: string]: Institucion } = {};
  nuevaInstitucion: Institucion = {
    idinstitucion: 0,
    instnombre: '',
    direccion: '',
    barrio: '',
  };
  mostrarFormulario = false;

  ngOnInit(): void {
    this.institucionService.getInstituciones().subscribe((data) => {
      this.instituciones = data;
    });
  }
  onRowEditInit(institucion: Institucion) {
    this.clonedProducts[institucion.idinstitucion] = {
      ...institucion,
    };
    console.log('Instituciones:', this.clonedProducts);
  }

  onRowEditSave(instituciones: Institucion) {
    this.institucionService.updateInstitucion(instituciones).subscribe(
      (response)=> {
        console.log('Institucion actualizada', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Institucion actualizada',
        });
        delete this.clonedProducts[instituciones.idinstitucion];
      },
      (error) => {
        console.error('Error al actualizar la institucion', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar la institucion',
        });
      }
    );
  
  }
  onRowEditCancel(institucion: Institucion, index: number) {
    this.instituciones[index] =
      this.clonedProducts[institucion.idinstitucion as number];
    delete this.clonedProducts[institucion.idinstitucion as number];
  }
  onRowEditDelete(institucion: Institucion, index: number) {
    this.institucionService.deleteInstitucion(institucion).subscribe(
      (data) => {
        console.log('Institucion eliminada', data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Institucion eliminada',
        });
        this.instituciones.splice(index, 1);
      },
      (error) => {
        console.error('Error al eliminar la institucion', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la institucion',
        });
      }
    );
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  crearInstitucion(): void {
    this.institucionService.crearInstitucion(this.nuevaInstitucion).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tutor creado exitosamente',
        });
        this.instituciones.push(data);
        this.nuevaInstitucion = {
          idinstitucion: 0,
          instnombre: '',
          direccion: '',
          barrio: '',
        };
        this.mostrarFormulario = false; // Ocultar el formulario después de crear la institución
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
}
