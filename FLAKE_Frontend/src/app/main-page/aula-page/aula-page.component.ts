import {
  Component,
  inject,
  input,
  OnInit,
  AfterViewInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AulaService } from '../../services/aula.service';
import { Aula, Estudiante } from '../../model/estudiante.model';
import { Asistencia } from '../../model/asistencia.model';
import { AsistenciaTutor } from '../../model/asistencia_tutor.model';
import { AulaStudentsService } from '../../services/aula-students.service';
import { CalendarModule } from 'primeng/calendar';
import { AsistenciaService } from '../../services/asistencia.service';
import { FormsModule } from '@angular/forms';
import { AsistenciaTutorService } from '../../services/asistencia-tutor.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { NotasEstudiantes } from '../../model/nota.model';
import { MessageService } from 'primeng/api';
import { NotasService } from '../../services/notas.service';
import { NotaEstudianteLista } from '../../model/notaget.model';
import {
  LocalStorageManagerService,
  StorageKey,
} from '../../services/local-storage-manager.service';

@Component({
  selector: 'app-aula-page',
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    InputSwitchModule,
    TableModule,
  ],
  templateUrl: './aula-page.component.html',
  styleUrl: './aula-page.component.css',
  providers: [MessageService],
})
export class AulaPageComponent implements OnInit, AfterViewInit {
  readonly id = input.required<number>();
  private messageService = inject(MessageService);

  aulaInfo: Aula | undefined;

  aulaService = inject(AulaService);
  aulaStudentsService = inject(AulaStudentsService);
  asistenciaService = inject(AsistenciaService);
  asistenciaTutorService = inject(AsistenciaTutorService);
  notasService = inject(NotasService);
  localStorageManagerService = inject(LocalStorageManagerService);
  clonedProducts: { [s: string]: NotasEstudiantes } = {};
  students: Estudiante[] = [];
  notas: NotasEstudiantes[] = [];
  notasLista: NotaEstudianteLista[] = [];
  fechaHoraSignal = signal<Date>(new Date());

  asistencias: Asistencia = {
    tutor_id: 0,
    aula_id: 0,
    fechaclase: new Date(),
    asistencias: [{ estudiante_id: 0, estado: '' }],
  };

  asistenciaTutor: AsistenciaTutor = {
    tutor: 0,
    aula: 0,
    fecha_asistencia: new Date(),
    hora_inicio: '',
  };

  notaEstudiante: NotasEstudiantes = {
    estudiante: 0,
    bloque1: 0,
    bloque2: 0,
    bloque3: 0,
    bloque4: 0,
    aula: 0,
    tutor: 0,
  };

  notaEstudianteLista: NotaEstudianteLista = {
    idnota: 0,
    estudiante: {
      idestudiante: 0,
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
    },
    aula: 0,
    bloque1: 0,
    bloque2: 0,
    bloque3: 0,
    bloque4: 0,
    calificacion_final: 0,
    tutor: 0,
  };

  mostrarNotas: boolean = false;

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    const tutorId = this.localStorageManagerService.getLocalStorage(
      StorageKey.ID
    );
    if (tutorId) {
      this.notaEstudianteLista.tutor = Number(tutorId);
    }
    this.aulaService.getAula(this.id()).subscribe((data) => {
      this.aulaInfo = data;
      this.loadStudents();
    });
  }
  loadStudents(): void {
    if (!this.aulaInfo) {
      return;
    }
    console.log('Loading students for aula', this.id());
    this.aulaStudentsService
      .getEstudiantesPorAula(this.id())
      .subscribe((students) => {
        this.students = students;
        this.asistencias.asistencias = this.students.map((student) => ({
          estudiante_id: student.idestudiante,
          estado: '',
        }));
        console.log(this.students);
      });
  }

  actualizarAsistencia(estudianteId: number, $event: Event): void {
    const estado = ($event.target as HTMLInputElement).value;
    const asistenciaEstudiante = this.asistencias.asistencias.find(
      (a) => a.estudiante_id === estudianteId
    );
    if (asistenciaEstudiante) {
      asistenciaEstudiante.estado = estado;
    }
    console.log(this.asistencias.asistencias);
  }
  tomarAsistencia(): void {
    this.asistencias.aula_id = this.id();
    this.asistenciaTutor.tutor = this.asistencias.tutor_id;
    this.asistenciaTutor.aula = this.asistencias.aula_id;
    this.asistenciaService.tomarAsistencia(this.asistencias).subscribe(
      () => {
        console.log('Asistencia tomada');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Asistencia tomada exitosamente',
        });
      },
      (error) => {
        console.error('Error al tomar asistencia', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al tomar asistencia',
        });
      }
    );
    this.asistenciaTutorService.tutorAsistencia(this.asistenciaTutor);
  }
  setHorario($event: Date): void {
    const formattedDate = $event.toISOString().split('T')[0];
    console.log(formattedDate);
    this.asistencias.fechaclase = formattedDate;
    this.asistenciaTutor.fecha_asistencia = formattedDate;

    const formattedTime = $event.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    this.asistenciaTutor.hora_inicio = formattedTime;

    console.log(this.asistenciaTutor.hora_inicio);
  }

  mostrarNotasEstudiantes(): void {
    console.log('Switch de Notas Estudiantes:', this.mostrarNotasEstudiantes);
    this.mostrarNotas = true;
    const notaEstudiante: NotasEstudiantes = {
      estudiante: this.notaEstudianteLista.estudiante.idestudiante,
      bloque1: this.notaEstudianteLista.bloque1,
      bloque2: this.notaEstudianteLista.bloque2,
      bloque3: this.notaEstudianteLista.bloque3,
      bloque4: this.notaEstudianteLista.bloque4,
      aula: this.notaEstudianteLista.aula,
      tutor: this.notaEstudianteLista.tutor,
    };

    this.notasService.getNotas(this.id()).subscribe((data) => {
      this.notasLista = data;
      console.log('Notas de estudiantes:', this.notasLista);
    });
  }

  onRowEditInit(estudiante: NotasEstudiantes): void {
    console.log(estudiante);
    this.clonedProducts[estudiante.estudiante] = { ...estudiante };
  }
  onRowEditSave(estudiante: NotaEstudianteLista) {
    console.log('Datos enviados para actualizar:', estudiante);
    this.notasService.actualizarNotas(estudiante).subscribe((response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Table is updated',
      });
      delete this.clonedProducts[estudiante.estudiante.idestudiante as number];
    });
  }
}
