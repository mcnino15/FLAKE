import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import {
  LocalStorageManagerService,
  StorageKey,
} from '../services/local-storage-manager.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  auth = inject(AuthService);
  localStorageManager = inject(LocalStorageManagerService);
  router = inject(Router);
  username = signal<string>('');
  password = signal<string>('');
  AuthService: any;

  constructor() {}
  login() {
    this.auth
      .login({ cedula: this.username(), password: this.password() })
      .subscribe((data) => {
        this.localStorageManager.setLocalStorage(StorageKey.TOKEN, data.access);
        this.localStorageManager.setLocalStorage(
          StorageKey.REFRESH,
          data.refresh
        );
        this.localStorageManager.setLocalStorage(
          StorageKey.ID,
          data.id.toString()
        );
        this.localStorageManager.setLocalStorage(StorageKey.ROLE, data.role);
        this.router.navigate(['/dashboard']);
      });
  }
}
