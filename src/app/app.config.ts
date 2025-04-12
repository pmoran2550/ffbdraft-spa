import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
//import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authHttpInterceptorFn, AuthModule, provideAuth0 } from '@auth0/auth0-angular';
import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_ALLOWED_URI } from './constants';
import { AppRoutingModule, routes } from './app-routing/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideAuth0({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      authorizationParams: {
        audience: AUTH0_AUDIENCE,
        redirect_uri: window.location.origin
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: AUTH0_ALLOWED_URI,
            tokenOptions: {
              authorizationParams: {
                audience: AUTH0_AUDIENCE
              },
            },
          }
        ],
      }
    }),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
  ]
};
