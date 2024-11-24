import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page.component';
import { StudentManagerComponent } from './student-manager/student-manager.component';
export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./student-manager/student-manager.component').then(
            (m) => m.StudentManagerComponent
          ),
      },
      {
        path: 'tutors',
        loadComponent: () =>
          import('./tutor-manager/tutor-manager.component').then(
            (m) => m.TutorManagerComponent
          ),
      },
      {
        path: 'aulasmg',
        loadComponent: () =>
          import('./aulas-manager/aulas-manager.component').then(
            (m) => m.AulasManagerComponent
          ),
      },
      {
        path: 'institutionsmg',
        loadComponent: () =>
          import('./institution-manager/institution-manager.component').then(
            (m) => m.InstitutionManagerComponent
          ),
      },
      {
        path: 'aula',
        loadComponent: () =>
          import('./aulas/aulas.component').then((m) => m.AulasComponent),
      },
      {
        path: 'assistance',
        loadComponent: () =>
          import('./asistencias/asistencias.component').then(
            (m) => m.AsistenciasComponent
          ),
      },
      {
        path: 'schedules',
        loadComponent: () =>
          import('./horarios/horarios.component').then(
            (m) => m.HorariosComponent
          ),
      },
      {
        path: 'aula/:id',
        loadComponent: () =>
          import('./aula-page/aula-page.component').then(
            (m) => m.AulaPageComponent
          ),
      },
    ],
  },
];
