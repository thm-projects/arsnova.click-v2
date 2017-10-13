import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NicknameSelectComponent} from './nickname-select.component';

describe('NicknameSelectComponent', () => {
  let component: NicknameSelectComponent;
  let fixture: ComponentFixture<NicknameSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [NicknameSelectComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NicknameSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
