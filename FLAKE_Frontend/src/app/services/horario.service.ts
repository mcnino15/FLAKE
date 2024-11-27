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
}
@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  http = inject(HttpClient);
  private url = 'http://localhost:8000/api/';
  createHorarioProfesor(horario: HorarioSend) {
    return this.http.post(
      this.url + 'horarios/' + 'crear_horario_con_profesor/',
      horario
    );
  }
  getHorariosOcupados() {
    return this.http.get<any[]>(`${this.url}horario-aulas/`);
  }
  createHorarioAula(horario: HorarioSend) {
    return this.http.post(
      this.url + 'horario-aulas/' + 'crear-horario-poraula/',
      horario
    );
  }
  getHorarios(idhorario: number) {
    return this.http.get(`${this.url}horario-aulas/${idhorario}`);
  }

  deleteHorario(idhorario: number) {
    return this.http.delete(`${this.url}horarios/${idhorario}`);
  }
}
