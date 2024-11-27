import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Estudiante } from '../model/estudiante.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AulaStudentsService {
  private apiUrl = 'http://localhost:8000/api/estudiantes/por-aula'; // Base URL

  constructor(private http: HttpClient) {}

  getEstudiantesPorAula(idaula: number): Observable<Estudiante[]> {
    const url = `${this.apiUrl}/${idaula}/`;
    return this.http.get<Estudiante[]>(url);
  }
}
