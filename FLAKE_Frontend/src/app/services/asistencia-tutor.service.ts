import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GeneralStatesManagementService } from './general-states-management.service';
import { finalize } from 'rxjs';
import { AsistenciaTutor } from '../model/asistencia_tutor.model';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaTutorService {
  private apiUrl = 'http://localhost:8000/api/asistencia-tutor/';
  http= inject(HttpClient);
  generalState=inject(GeneralStatesManagementService);

  tutorAsistencia(asistencia: AsistenciaTutor): void {
    this.generalState.loading.set(true);
    this.http.post<any>(this.apiUrl + 'registrar/', asistencia).pipe(
      finalize(() => {
        this.generalState.loading.set(false);
      })
    ).subscribe((data) => {
        console.log(data);
      });

  }


}
