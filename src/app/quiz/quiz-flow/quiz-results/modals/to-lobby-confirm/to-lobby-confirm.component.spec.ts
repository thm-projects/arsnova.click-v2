import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToLobbyConfirmComponent } from './to-lobby-confirm.component';

describe('ToLobbyConfirmComponent', () => {
  let component: ToLobbyConfirmComponent;
  let fixture: ComponentFixture<ToLobbyConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToLobbyConfirmComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToLobbyConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
