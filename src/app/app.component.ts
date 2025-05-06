import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransferenciaComponent } from './transferencia.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TransferenciaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'transferencia-app';
}