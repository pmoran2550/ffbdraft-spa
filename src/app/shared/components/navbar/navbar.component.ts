import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { LoginButtonComponent } from '../buttons/login-button/login-button.component';
import { LogoutButtonComponent } from '../buttons/logout-button/logout-button.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatMenuModule,
      HttpClientModule,
      RouterModule,
      AsyncPipe,
      MatCardModule,
      MatCheckboxModule,
      FormsModule,
      FontAwesomeModule, 
      LoginButtonComponent,
      LogoutButtonComponent,
      MatDialogModule,
      ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private authService = inject(AuthenticationService);
  

  isAuthenticated$ = this.authService.isAuthenticated$;
  user$ = this.authService.user$;
  isAdmin$ = this.authService.isAdmin$;

}
