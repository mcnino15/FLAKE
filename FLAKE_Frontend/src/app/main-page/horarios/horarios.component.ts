import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HorarioService, HorarioSend } from '../../services/horario.service';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import {
  AgendaService,
  DayService,
  EventSettingsModel,
  MonthAgendaService,
  MonthService,
  ScheduleComponent,
  ScheduleModule,
  TimelineMonthService,
  TimelineViewsService,
  WeekService,
  WorkWeekService,
} from '@syncfusion/ej2-angular-schedule';
interface Dia {
  name: string;
  code: string;
}
interface DataSource {
  id: number;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  IsAllDay: boolean;
}
@Component({
  selector: 'app-horarios',
  standalone: true,

  imports: [
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule,
    CommonModule,
    ScheduleModule,
  ],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css'],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
    MonthAgendaService,
    TimelineViewsService,
    TimelineMonthService,
  ],
})
export class HorariosComponent implements OnInit {
  @ViewChild('scheduleObj')
  public scheduleObj?: ScheduleComponent;
  eventSettings: EventSettingsModel = { dataSource: [] };
  dias: Dia[] = [];
  horarioService = inject(HorarioService);
  ngOnInit(): void {
    this.dias = [
      { name: 'Lunes', code: 'LU' },
      { name: 'Martes', code: 'MA' },
      { name: 'Miércoles', code: 'MI' },
      { name: 'Jueves', code: 'JU' },
      { name: 'Viernes', code: 'VI' },
    ];
    this.reloadHorario();
  }
  reloadHorario() {
    const dayMapping: { [key: string]: string } = {
      LU: 'MO',
      MA: 'TU',
      MI: 'WE',
      JU: 'TH',
      VI: 'FR',
      L: 'MO',
    };

    this.horarioService.getHorariosOcupados().subscribe((horarios) => {
      const data = horarios
        .map((horario) => {
          const dayCode = dayMapping[horario.diainicial];
          if (!dayCode) {
            console.error(`Día inicial inválido: ${horario.diainicial}`);
            return null;
          }

          // Validar y formatear fechas
          const startDate = new Date(`${horario.fechainicio}`);
          const endDate = new Date(`${horario.fechafin}`);
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Fecha inválida en horario:', horario);
            return null;
          }

          // Limitar recurrencias con COUNT
          const recurrenceRule = `FREQ=WEEKLY;BYDAY=${dayCode};INTERVAL=1;`;

          return {
            Id: horario.idhorario,
            Subject: `Aula ${horario.aula}`,
            StartTime: new Date(
              `${horario.fechainicio}T${horario.hora_inicio}`
            ),
            EndTime: new Date(`${horario.fechainicio}T${horario.hora_fin}`),
            IsAllDay: false,
            RecurrenceRule: recurrenceRule,
          };
        })
        .filter((event) => event !== null);

      console.log('Eventos mapeados:', data);

      this.eventSettings = { dataSource: data };
    });
  }
  horario: HorarioSend = {
    fechainicio: '',
    fechafin: '',
    hora_inicio: '',
    hora_fin: '',
    diainicial: '',
    diainicial_text: '',
    aula: 0,
  };

  constructor() {}

  mostrarFormulario = false;

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
  crearHorarioAula() {
    // Asegura que las horas estén en formato 'HH:MM'
    if (this.horario.hora_inicio) {
      this.horario.hora_inicio = this.horario.hora_inicio.substring(0, 5);
    }
    if (this.horario.hora_fin) {
      this.horario.hora_fin = this.horario.hora_fin.substring(0, 5);
    }

    this.horarioService.createHorarioAula(this.horario).subscribe(
      (response) => {
        console.log('Horario creado exitosamente', response);
      },
      (error) => {
        console.error('Error al crear el horario', error);
      }
    );
    this.reloadHorario();
  }

  borrarHorarioAula(){
    this.horarioService.deleteHorario(1).subscribe(
      (response) => {
        console.log('Horario eliminado exitosamente', response);
      },
      (error) => {
        console.error('Error al eliminar el horario', error);
      }
    );
    this.reloadHorario();
  }
}
