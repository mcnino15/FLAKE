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
  isTutor = !this.auth.isAdministrator();
  rutasAside = [
    { nombre: 'Perfil', path: 'profile', icon: 'pi pi-user', forTutor: true },
    {
      nombre: 'Gestión de estudiantes',
      path: 'students',
      icon: 'pi pi-users',
      forTutor: false,
    },
    {
      nombre: 'Gestión de tutores',
      path: 'tutors',
      icon: 'pi pi-briefcase',
      forTutor: false,
    },
    {
      nombre: 'Gestión de aulas',
      path: 'aulasmg',
      icon: 'pi pi-home',
      forTutor: false,
    },
    {
      nombre: 'Instituciones',
      path: 'institutionsmg',
      icon: 'pi pi-building',
      forTutor: false,
    },
    {
      nombre: 'Aulas',
      path: 'aula',
      icon: 'pi pi-building-columns',
      forTutor: true,
    },
    {
      nombre: 'Horarios',
      path: 'schedules',
      icon: 'pi pi-calendar-clock',
      forTutor: false,
    },
  ];
  mainPage() {
    this.showWelcomeMessage = true;
    this.router.navigate(['/dashboard']);
  }
  logout() {
    this.auth.logOut();
    console.log(this.auth.isLoggedIn());
    this.router.navigate(['/login']);
  }
  onActivate(): void {
    this.showWelcomeMessage = false;
  }
}
