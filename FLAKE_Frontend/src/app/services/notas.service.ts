import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotasEstudiantes } from '../model/nota.model';
import { NotaEstudianteLista } from '../model/notaget.model';
import { GeneralStatesManagementService } from './general-states-management.service';

@Injectable({
  providedIn: 'root',
})
export class NotasService {
  private apiUrl = 'http://localhost:8000/api/notas/';
  constructor(private http: HttpClient) {}
  generalStatesManagementService = inject(GeneralStatesManagementService);

  getNotas(aula: Number): Observable<NotaEstudianteLista[]> {
    const url = `${this.apiUrl}estudiantes-por-aula/${aula}/`;

    this.generalStatesManagementService.loading.set(true);
    return this.http.get<NotaEstudianteLista[]>(url).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  actualizarNotas(nota: NotaEstudianteLista): Observable<any> {
    console.log(nota);
    const url = `${this.apiUrl}actualizar-notas/${nota.estudiante.idestudiante}/${nota.aula}/`;
    this.generalStatesManagementService.loading.set(true);
    return this.http.put<any>(url, nota).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
}
