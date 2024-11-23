import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tutor } from '../model/tutor.model';

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  private apiUrl = 'http://localhost:8000/api/tutores/';
  private apiUrlput = 'http://localhost:8000/api/tutores/{idtutor}/';

  constructor(private http: HttpClient) {}

  getTutores(): Observable<Tutor[]> {
    return this.http.get<Tutor[]>(this.apiUrl + `listar-tutores/`);
  }
  updateTutor(tutor: Tutor): Observable<Tutor[]> {
    const url = `${this.apiUrl}${tutor.idtutor}/`;
    console.log('Updating tutor at URL:', url);
    return this.http.put<Tutor[]>(url, tutor);
  }
  createTutor(tutor: Tutor): Observable<Tutor> {
    console.log('Creating tutor with data:', tutor);
    return this.http.post<Tutor>(`${this.apiUrl}creartutor/`, tutor);
  }
  deleteTutor(tutor: Tutor): Observable<Tutor> {
    const url = `${this.apiUrl}${tutor.idtutor}/`;
    console.log('Deleting tutor at URL:', url);
    return this.http.delete<Tutor>(url);
  }
}
