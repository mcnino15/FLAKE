import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthTokens } from '../model/auth';
import { LocalStorageManagerService, StorageKey } from './local-storage-manager.service';
import { Observable } from 'rxjs';
import { Persona } from '../model/tutor.model';

interface Credentials {
  cedula: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  localStorageManager = inject(LocalStorageManagerService);
  readonly baseUrl = 'http://localhost:8000';

  login(credentials: Credentials): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.baseUrl}/login/`, credentials);
  }

  logOut() {
    this.localStorageManager.removeLocalStorage(StorageKey.TOKEN);
    this.localStorageManager.removeLocalStorage(StorageKey.REFRESH);
  }

  isLoggedIn() {
    return this.localStorageManager.getLocalStorage(StorageKey.TOKEN) !== null;
  }

  getUserInfo(): Observable<Persona> {
    const token = this.localStorageManager.getLocalStorage(StorageKey.TOKEN);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Persona>(`${this.baseUrl}/api/personas/me/`, { headers });
  }
}
