import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-logout-button',
  template: `
    <button  (click)="handleLogout()">Log Out</button>
  `,
  standalone: true
})
export class LogoutButtonComponent {
  private authService = inject(AuthenticationService);

  handleLogout(): void {
    this.authService.logout();
  }
}