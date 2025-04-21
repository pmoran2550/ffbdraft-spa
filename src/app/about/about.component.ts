import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { APP_VERSION } from '../constants';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  currentYear: number = new Date().getFullYear();
  versionNumber: string = APP_VERSION;
  
}
