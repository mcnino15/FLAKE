import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
export interface HorarioSend {
  fechainicio: string;
  fechafin: string;
  hora_inicio: string;
  hora_fin: string;
  diainicial: string;
  diainicial_text: string;
  aula: number;
  profesor: number;
}
@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  http = inject(HttpClient);
  private url = 'http://localhost:8000/api/horarios/';
  createHorario(horario: HorarioSend) {
    return this.http.post(this.url + 'crear_horario_con_profesor/', horario);
  }
}
