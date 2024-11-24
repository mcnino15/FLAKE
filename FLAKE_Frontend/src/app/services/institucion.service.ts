import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { Institucion } from '../model/institucion.model';
import { GeneralStatesManagementService } from './general-states-management.service';

@Injectable({
  providedIn: 'root',
})
export class InstitucionService {
  private apiUrl = 'http://localhost:8000//api/instituciones/';
  private apiURLnew =
    'http://localhost:8000//api/instituciones/create_institucion/';

  constructor(private http: HttpClient) {}

  generalStatesManagementService = inject(GeneralStatesManagementService);

  getInstituciones(): Observable<any[]> {
    this.generalStatesManagementService.loading.set(true);
    return this.http.get<any[]>(this.apiUrl).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  crearInstitucion(institucion: any): Observable<any> {
    this.generalStatesManagementService.loading.set(true);
    return this.http.post<any>(this.apiURLnew, institucion).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  deleteInstitucion(institucion: Institucion): Observable<Institucion> {
    this.generalStatesManagementService.loading.set(true);
    const url = `${this.apiUrl}${institucion.idinstitucion}/`;
    console.log('Deleting institucion at URL:', url);
    return this.http.delete<Institucion>(url).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  updateInstitucion(institucion: any): Observable<any[]> {
    this.generalStatesManagementService.loading.set(true);
    const url = `${this.apiUrl}${institucion.idinstitucion}/`;
    console.log('Updating institucion at URL:', url);
    return this.http.put<any[]>(url, institucion).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
}
