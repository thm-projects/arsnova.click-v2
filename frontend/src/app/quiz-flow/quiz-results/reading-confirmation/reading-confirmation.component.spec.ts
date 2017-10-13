import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingConfirmationComponent } from './reading-confirmation.component';

describe('ReadingConfirmationComponent', () => {
  let component: ReadingConfirmationComponent;
  let fixture: ComponentFixture<ReadingConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadingConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
