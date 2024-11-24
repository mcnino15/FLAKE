import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { Tutor } from '../model/tutor.model';
import { GeneralStatesManagementService } from './general-states-management.service';

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  private apiUrl = 'http://localhost:8000/api/tutores/';
  private apiUrlput = 'http://localhost:8000/api/tutores/{idtutor}/';

  constructor(private http: HttpClient) {}
  generalStatesManagementService = inject(GeneralStatesManagementService);

  getTutores(): Observable<Tutor[]> {
    this.generalStatesManagementService.loading.set(true);
    return this.http.get<Tutor[]>(this.apiUrl + `listar-tutores/`).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  updateTutor(tutor: Tutor): Observable<Tutor[]> {
    this.generalStatesManagementService.loading.set(true);
    const url = `${this.apiUrl}${tutor.idtutor}/`;
    console.log('Updating tutor at URL:', url);
    return this.http.put<Tutor[]>(url, tutor).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  createTutor(tutor: Tutor): Observable<Tutor> {
    this.generalStatesManagementService.loading.set(true);
    console.log('Creating tutor with data:', tutor);
    return this.http.post<Tutor>(`${this.apiUrl}creartutor/`, tutor).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
  deleteTutor(tutor: Tutor): Observable<Tutor> {
    this.generalStatesManagementService.loading.set(true);
    const url = `${this.apiUrl}${tutor.idtutor}/`;
    console.log('Deleting tutor at URL:', url);
    return this.http.delete<Tutor>(url).pipe(
      finalize(() => {
        this.generalStatesManagementService.loading.set(false);
      })
    );
  }
}
