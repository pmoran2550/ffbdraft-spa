import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PickFfbTeamFormComponent } from './pick-ffb-team-form.component';

describe('PickFfbTeamFormComponent', () => {
  let component: PickFfbTeamFormComponent;
  let fixture: ComponentFixture<PickFfbTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickFfbTeamFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: false }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PickFfbTeamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
