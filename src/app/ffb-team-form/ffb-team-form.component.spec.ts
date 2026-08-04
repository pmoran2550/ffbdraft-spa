import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';

import { FfbTeamFormComponent } from './ffb-team-form.component';

describe('FfbTeamFormComponent', () => {
  let component: FfbTeamFormComponent;
  let fixture: ComponentFixture<FfbTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FfbTeamFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FfbTeamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
