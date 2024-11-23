import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../model/tutor.model';
import { LocalStorageManagerService, StorageKey } from './local-storage-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private localStorageManager = inject(LocalStorageManagerService);
  private apiUrl = 'http://localhost:8000/api/personas/me/'; // Asegúrate de que esta URL sea correcta

  constructor() { }

  getUserInfo(): Observable<Persona> {
    const token = this.localStorageManager.getLocalStorage(StorageKey.TOKEN); // Obtén el token de autenticación desde el almacenamiento local
    if (!token) {
      throw new Error('No auth token found');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Persona>(this.apiUrl, { headers });
  }
}
