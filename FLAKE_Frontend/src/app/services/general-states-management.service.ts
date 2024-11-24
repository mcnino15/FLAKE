import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralStatesManagementService {
  loading = signal(false);
  constructor() { }
}
