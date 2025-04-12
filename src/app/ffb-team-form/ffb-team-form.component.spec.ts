import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FfbTeamFormComponent } from './ffb-team-form.component';

describe('FfbTeamFormComponent', () => {
  let component: FfbTeamFormComponent;
  let fixture: ComponentFixture<FfbTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FfbTeamFormComponent]
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
