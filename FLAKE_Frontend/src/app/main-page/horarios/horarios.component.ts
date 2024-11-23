import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
@Component({
  selector: 'app-horarios',
  imports: [FormsModule, InputTextModule, FloatLabelModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.css',
})
export class HorariosComponent {
  value: string = ' ';
}
