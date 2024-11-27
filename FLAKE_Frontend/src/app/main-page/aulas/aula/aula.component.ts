import { Component, inject, Input, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Aula, Estudiante } from '../../../model/estudiante.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aula',
  imports: [CardModule, ButtonModule, RouterLink, CommonModule],
  templateUrl: './aula.component.html',
  styleUrl: './aula.component.css',
})
export class AulaComponent {

  readonly aula = input.required<Aula>();
  
}
