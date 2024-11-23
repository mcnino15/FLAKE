import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aula } from '../model/aula.model'; 

@Injectable({
  providedIn: 'root',
})
export class AulaService {
  private apiUrl = 'http://localhost:8000/api/aulas/'; 

  constructor(private http: HttpClient) {}

  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.apiUrl);
  }
  createAula(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(this.apiUrl + 'crear-aula', aula);
  }
  updateAula(aula: Aula): Observable<Aula> {
    return this.http.put<Aula>(
      this.apiUrl + 'update-aula/' + aula.idaula,
      aula
    );
  }
  deleteAula(aula: Aula): Observable<Aula> {
    return this.http.delete<Aula>(this.apiUrl +  aula.idaula + '/');
  }
}

