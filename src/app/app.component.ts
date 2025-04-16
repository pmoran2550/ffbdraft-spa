import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, AsyncPipe, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatCardModule} from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginButtonComponent } from "./shared/components/buttons/login-button/login-button.component";
import { LogoutButtonComponent } from './shared/components/buttons/logout-button/logout-button.component';
import { map, Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    HomeComponent,
    RouterOutlet,
    HttpClientModule,
    RouterModule,
    AsyncPipe,
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    FontAwesomeModule, 
    LoginButtonComponent,
    LogoutButtonComponent,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
  }

  private authService = inject(AuthenticationService);

  title = 'ffbdraft-spa';
  isAuthenticated$ = this.authService.isAuthenticated$;
  user$ = this.authService.user$;
  isAdmin$ = this.authService.isAdmin$;
}
