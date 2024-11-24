import { Component, inject, input, OnInit, signal } from '@angular/core';
import { AulaService } from '../../services/aula.service';
import { Aula } from '../../model/estudiante.model';

@Component({
  selector: 'app-aula-page',
  imports: [],
  templateUrl: './aula-page.component.html',
  styleUrl: './aula-page.component.css',
})
export class AulaPageComponent implements OnInit {
  readonly id = input.required<number>();
  aulaInfo: Aula | undefined;
  aulaService = inject(AulaService);
  ngOnInit(): void {
    this.aulaService.getAula(this.id()).subscribe((data) => {
      this.aulaInfo = data;
    });
  }
}
