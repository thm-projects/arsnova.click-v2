import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModeComponent } from './add-mode.component';

describe('AddModeComponent', () => {
  let component: AddModeComponent;
  let fixture: ComponentFixture<AddModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddModeComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a TYPE reference', () => {
    expect(AddModeComponent.TYPE).toEqual('AddModeComponent');
  });
});
