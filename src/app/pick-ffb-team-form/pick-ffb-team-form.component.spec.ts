import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickFfbTeamFormComponent } from './pick-ffb-team-form.component';

describe('PickFfbTeamFormComponent', () => {
  let component: PickFfbTeamFormComponent;
  let fixture: ComponentFixture<PickFfbTeamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickFfbTeamFormComponent]
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
