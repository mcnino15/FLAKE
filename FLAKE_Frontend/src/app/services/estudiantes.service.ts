import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { Estudiante, EstudianteCrear } from '../model/estudiante.model';
import { GeneralStatesManagementService } from './general-states-management.service';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  private apiURLnew = 'http://localhost:8000/api/estudiantes/';
  generalStatesManagementService = inject(GeneralStatesManagementService);
  constructor(private http: HttpClient) {}

  crearEstudiante(estudiante: EstudianteCrear): Observable<Estudiante> {
    this.generalStatesManagementService.loading.set(true);
    return this.http.post<Estudiante>(
      this.apiURLnew + 'crearestudiante/',
      estudiante).pipe(
        finalize(() => {
          this.generalStatesManagementService.loading.set(false);
        })
      );
  }

  getEstudiantes(): Observable<Estudiante[]> {
    this.generalStatesManagementService.loading.set(true);
    return this.http.get<Estudiante[]>(this.apiURLnew + 'listar-estudiantes/').pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }

  updateEstudiante(estudiante: any): Observable<Estudiante[]> {
    this.generalStatesManagementService.loading.set(true);
    const url = `${this.apiURLnew}${estudiante.idestudiante}/`;
    console.log('Updating estudiante at URL:', url);
    return this.http.put<Estudiante[]>(url, estudiante).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );  
  }

  deleteEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    this.generalStatesManagementService.loading.set(true);
    const url = `${this.apiURLnew}${estudiante.idestudiante}/`;
    console.log('Deleting estudiante at URL:', url);
    return this.http.delete<Estudiante>(url).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
}
