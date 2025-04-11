import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-button',
  template: `
    <button  (click)="handleLogin()">Log In</button>
  `,
  standalone: true
})
export class LoginButtonComponent {
  private auth = inject(AuthService);

  handleLogin(): void {
    this.auth.loginWithRedirect();
  }
}