import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estudiante, EstudianteCrear } from '../model/estudiante.model';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  private apiURLnew = 'http://localhost:8000/api/estudiantes/';
  constructor(private http: HttpClient) {}

  crearEstudiante(estudiante: EstudianteCrear): Observable<Estudiante> {
    return this.http.post<Estudiante>(
      this.apiURLnew + 'crear-estudiante/',
      estudiante
    );
  }

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiURLnew + 'listar-estudiantes/');
  }

  updateEstudiante(estudiante: any): Observable<Estudiante[]> {
    const url = `${this.apiURLnew}${estudiante.idestudiante}/`;
    console.log('Updating estudiante at URL:', url);
    return this.http.put<Estudiante[]>(url, estudiante);  
  }

  deleteEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    const url = `${this.apiURLnew}${estudiante.idestudiante}/`;
    console.log('Deleting estudiante at URL:', url);
    return this.http.delete<Estudiante>(url);
  }
}
