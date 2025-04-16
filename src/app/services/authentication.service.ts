import { inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { map, Observable, of } from 'rxjs';
import { AUTH0_FFBCLAIM } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private auth = inject(AuthService);
  private doc = inject(DOCUMENT);

  private readonly ffbClaim = AUTH0_FFBCLAIM;

  isAuthenticated$: Observable<boolean> = this.auth.isAuthenticated$;
  user$ = this.auth.user$;
  isAdmin$: Observable<boolean> = this.auth.user$.pipe(
    map(user => Array.isArray(user?.[this.ffbClaim]) && user[this.ffbClaim].includes('admin'))
  );


  constructor() { }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin,
      },
    });
  }
}
