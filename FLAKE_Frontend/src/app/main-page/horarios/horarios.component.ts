import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HorarioService, HorarioSend } from '../../services/horario.service';
import { DropdownModule } from 'primeng/dropdown';
interface Dia {
  name: string;
  code: string;
}
@Component({
  selector: 'app-horarios',
  imports: [FormsModule, InputTextModule, FloatLabelModule, DropdownModule],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css'],
})
export class HorariosComponent implements OnInit {
  dias: Dia[] = [];

  ngOnInit(): void {
    this.dias = [
      { name: 'Lunes', code: 'LU' },
      { name: 'Martes', code: 'MA' },
      { name: 'Miércoles', code: 'MI' },
      { name: 'Jueves', code: 'JU' },
      { name: 'Viernes', code: 'VI' },
      { name: 'Sábado', code: 'SA' },
      { name: 'Domingo', code: 'DO' },
    ];
  }
  horario: HorarioSend = {
    fechainicio: '',
    fechafin: '',
    hora_inicio: '',
    hora_fin: '',
    diainicial: '',
    diainicial_text: '',
    aula: 0,
    profesor: 0,
  };

  constructor(private horarioService: HorarioService) {}

  crearHorario() {
    // Asegura que las horas estén en formato 'HH:MM'
    if (this.horario.hora_inicio) {
      this.horario.hora_inicio = this.horario.hora_inicio.substring(0, 5);
    }
    if (this.horario.hora_fin) {
      this.horario.hora_fin = this.horario.hora_fin.substring(0, 5);
    }

    this.horarioService.createHorario(this.horario).subscribe(
      (response) => {
        console.log('Horario creado exitosamente', response);
      },
      (error) => {
        console.error('Error al crear el horario', error);
      }
    );
  }
}
