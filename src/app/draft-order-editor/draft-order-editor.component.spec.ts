import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftOrderEditorComponent } from './draft-order-editor.component';

describe('DraftOrderEditorComponent', () => {
  let component: DraftOrderEditorComponent;
  let fixture: ComponentFixture<DraftOrderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DraftOrderEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftOrderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
