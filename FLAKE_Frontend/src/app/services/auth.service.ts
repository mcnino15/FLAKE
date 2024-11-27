import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthTokens } from '../model/auth';
import {
  LocalStorageManagerService,
  StorageKey,
} from './local-storage-manager.service';
import { finalize, Observable } from 'rxjs';
import { Persona } from '../model/tutor.model';
import { GeneralStatesManagementService } from './general-states-management.service';

interface Credentials {
  cedula: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  localStorageManager = inject(LocalStorageManagerService);
  generalStatesManagementService = inject(GeneralStatesManagementService);
  readonly baseUrl = 'http://localhost:8000/api/';

  login(credentials: Credentials): Observable<AuthTokens> {
    this.generalStatesManagementService.loading.set(true);
    return this.http
      .post<AuthTokens>(`${this.baseUrl}token/`, credentials)
      .pipe(
        finalize(() => {
          this.generalStatesManagementService.loading.set(false);
        })
      );
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
    return this.http.get<Persona>(`${this.baseUrl}personas/me/`, {
      headers,
    });
  }
  isAdministrator(): boolean {
    return (
      this.localStorageManager.getLocalStorage(StorageKey.ROLE) ===
      'administrador'
    );
  }
}
