import { Component, OnInit, inject } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Persona } from '../../model/tutor.model';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule, // Asegúrate de incluir esto
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  userInfo: Persona | null = null;

  ngOnInit(): void {
    this.profileService.getUserInfo().subscribe(
      (data) => {
        this.userInfo = data;
      },
      (error) => {
        console.error('Error al obtener la información del usuario', error);
      }
    );
  }
}
