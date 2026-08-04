import { of } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { AuthenticationService } from '../services/authentication.service';

// Stand-in for the Auth0 AuthService so tests don't need a real auth0.client.
// Cast to the real type so components can inject it as if it were genuine.
export const mockAuthService = {
  isAuthenticated$: of(false),
  user$: of(null),
  isLoading$: of(false),
  idTokenClaims$: of(null),
  error$: of(undefined),
  appState$: of(undefined),
  loginWithRedirect: () => of(undefined),
  logout: () => of(undefined),
} as unknown as AuthService;

// Stand-in for the app's own AuthenticationService wrapper.
export const mockAuthenticationService = {
  isAuthenticated$: of(false),
  user$: of(null),
  isAdmin$: of(false),
  login: () => {},
  logout: () => {},
} as unknown as AuthenticationService;
