import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { Aula } from '../model/aula.model';
import { GeneralStatesManagementService } from './general-states-management.service';

@Injectable({
  providedIn: 'root',
})
export class AulaService {
  private apiUrl = 'http://localhost:8000/api/aulas/';

  constructor(private http: HttpClient) {}

  generalStatesManagementService = inject(GeneralStatesManagementService);

  getAulas(): Observable<Aula[]> {
    this.generalStatesManagementService.loading.set(true);
    return this.http.get<Aula[]>(this.apiUrl).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  getAula(id: number): Observable<Aula> {
    this.generalStatesManagementService.loading.set(true);
    return this.http.get<Aula>(this.apiUrl + id + '/').pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  createAula(aula: Aula): Observable<Aula> {
    this.generalStatesManagementService.loading.set(true);
    return this.http.post<Aula>(this.apiUrl + 'crear_aula/', aula).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  updateAula(aula: Aula): Observable<Aula> {
    this.generalStatesManagementService.loading.set(true);

    return this.http.put<Aula>(this.apiUrl + aula.idaula + '/', aula).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  deleteAula(aula: Aula): Observable<Aula> {
    this.generalStatesManagementService.loading.set(true);
    return this.http.delete<Aula>(this.apiUrl + aula.idaula + '/').pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
}
