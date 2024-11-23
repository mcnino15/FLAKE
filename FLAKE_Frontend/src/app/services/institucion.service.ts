import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Institucion } from '../model/institucion.model';

@Injectable({
  providedIn: 'root',
})
export class InstitucionService {
  private apiUrl = 'http://localhost:8000//api/instituciones/';
  private apiURLnew =
    'http://localhost:8000//api/instituciones/create_institucion/';
  constructor(private http: HttpClient) {}

  getInstituciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  crearInstitucion(institucion: any): Observable<any> {
    return this.http.post<any>(this.apiURLnew, institucion);
  }
  deleteInstitucion(institucion: Institucion): Observable<Institucion> {
    const url = `${this.apiUrl}${institucion.idinstitucion}/`;
    console.log('Deleting institucion at URL:', url);
    return this.http.delete<Institucion>(url);
  }
  updateInstitucion(institucion: any): Observable<any[]> {
    const url = `${this.apiUrl}${institucion.idinstitucion}/`;
    console.log('Updating institucion at URL:', url);
    return this.http.put<any[]>(url, institucion);
  }
}
