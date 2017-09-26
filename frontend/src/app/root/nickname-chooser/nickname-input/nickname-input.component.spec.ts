import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NicknameInputComponent } from './nickname-input.component';

describe('NicknameInputComponent', () => {
  let component: NicknameInputComponent;
  let fixture: ComponentFixture<NicknameInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NicknameInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NicknameInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
