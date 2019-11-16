import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataErrorComponent } from './no-data-error.component';

describe('NoDataErrorComponent', () => {
  let component: NoDataErrorComponent;
  let fixture: ComponentFixture<NoDataErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoDataErrorComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
