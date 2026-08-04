import { TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';

import { AuthenticationService } from './authentication.service';
import { mockAuthService } from '../testing/auth-mocks';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
