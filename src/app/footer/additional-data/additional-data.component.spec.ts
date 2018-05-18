import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDataComponent } from './additional-data.component';

describe('AdditionalDataComponent', () => {
  let component: AdditionalDataComponent;
  let fixture: ComponentFixture<AdditionalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
