import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyOutputComponent } from './key-output.component';

describe('KeyOutputComponent', () => {
  let component: KeyOutputComponent;
  let fixture: ComponentFixture<KeyOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeyOutputComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should contain a TYPE reference', () => {
    expect(KeyOutputComponent.TYPE).toEqual('KeyOutputComponent');
  });
});
