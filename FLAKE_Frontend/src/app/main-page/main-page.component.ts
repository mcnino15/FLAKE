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
  dateToday = new Date();
  auth = inject(AuthService);
  profileService = inject(ProfileService);
  router = inject(Router);
  showWelcomeMessage: boolean = true;
  rutasAside = [
    { nombre: 'Perfil', path: 'profile'},
    { nombre: 'Gestión de estudiantes', path: 'students', icon:'pi pi-users' },
    { nombre: 'Gestión de tutores', path: 'tutors', icon:'pi pi-briefcase' },
    { nombre: 'Gestión de aulas', path: 'aulasmg' , icon:'pi pi-home'},
    { nombre: 'Instituciones', path: 'institutionsmg'},
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
