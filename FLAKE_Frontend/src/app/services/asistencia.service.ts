import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GeneralStatesManagementService } from './general-states-management.service';
import { Asistencia } from '../model/asistencia.model';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = 'http://localhost:8000/api/asistencia/';
  constructor(private http: HttpClient) {}
  generalStatesManagementService = inject(GeneralStatesManagementService);

  tomarAsistencia(asistencia: Asistencia): Observable<any> {
    this.generalStatesManagementService.loading.set(true);
    return this.http
      .post<any>(this.apiUrl + 'tomar-asistencia/', asistencia)
      .pipe(
        finalize(() => {
          this.generalStatesManagementService.loading.set(false);
        })
      );
  }
}
