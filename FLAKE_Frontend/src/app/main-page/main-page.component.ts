import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TutorService } from '../services/tutor.service';
import { ProfileService } from '../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-main-page',
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {
  auth = inject(AuthService);
  profileService = inject(ProfileService);
  router = inject(Router);
  showWelcomeMessage: boolean = true;
  rutasAside = [
    { nombre: 'Perfil', path: 'profile' },
    { nombre: 'Gestión de estudiantes', path: 'students' },
    { nombre: 'Gestión de tutores', path: 'tutors' },
    { nombre: 'Gestión de aulas', path: 'aulasmg' },
    { nombre: 'Instituciones', path: 'institutionsmg' },
    { nombre: 'Aulas', path: 'aula' },
    { nombre: 'Asistencias', path: 'assistance' },
    { nombre: 'Horarios', path: 'schedules' },
  ];

  logout() {
    this.auth.logOut();
    console.log(this.auth.isLoggedIn());
    this.router.navigate(['/login']);
  }
  onActivate(): void {
    this.showWelcomeMessage = false;
  }
}
