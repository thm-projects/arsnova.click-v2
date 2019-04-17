import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModeConfirmComponent } from './edit-mode-confirm.component';

describe('EditModeConfirmComponent', () => {
  let component: EditModeConfirmComponent;
  let fixture: ComponentFixture<EditModeConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditModeConfirmComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModeConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
