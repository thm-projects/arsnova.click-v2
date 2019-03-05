import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerUnavailableModalComponent } from './server-unavailable-modal.component';

describe('ServerUnavailableModalComponent', () => {
  let component: ServerUnavailableModalComponent;
  let fixture: ComponentFixture<ServerUnavailableModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServerUnavailableModalComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerUnavailableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
