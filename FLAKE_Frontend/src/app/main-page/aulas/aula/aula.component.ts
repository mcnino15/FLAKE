import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Aula } from '../../../model/estudiante.model';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-aula',
  imports: [CardModule, ButtonModule, RouterLink],
  templateUrl: './aula.component.html',
  styleUrl: './aula.component.css',
})
export class AulaComponent {
  readonly aula = input.required<Aula>();
}
