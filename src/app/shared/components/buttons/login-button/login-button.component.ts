import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-login-button',
  template: `
    <button  (click)="handleLogin()">Log In</button>
  `,
  standalone: true
})
export class LoginButtonComponent {
  private authService = inject(AuthenticationService);

  handleLogin(): void {
    this.authService.login();
  }
}