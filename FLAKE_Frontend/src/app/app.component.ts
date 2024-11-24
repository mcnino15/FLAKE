import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./loader/loader.component";
import { GeneralStatesManagementService } from './services/general-states-management.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, LoaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FLAKE_Frontend';
  generalStatesManagementService = inject(GeneralStatesManagementService);
}
