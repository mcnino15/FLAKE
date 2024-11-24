import { Component, inject, OnInit } from '@angular/core';
import { AulaService } from '../../services/aula.service';
import { Aula } from '../../model/estudiante.model';
import { AulaComponent } from "./aula/aula.component";

@Component({
  selector: 'app-aulas',
  imports: [AulaComponent],
  templateUrl: './aulas.component.html',
  styleUrl: './aulas.component.css',
})
export class AulasComponent implements OnInit {
  aulaService = inject(AulaService);
  aulas: Aula[] = [];
  ngOnInit(): void {
    this.aulaService.getAulas().subscribe((data) => {
      this.aulas = data;
    });
  }
}
