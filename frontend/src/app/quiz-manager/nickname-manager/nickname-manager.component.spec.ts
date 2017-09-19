import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NicknameManagerComponent} from './nickname-manager.component';

describe('NicknameManagerComponent', () => {
  let component: NicknameManagerComponent;
  let fixture: ComponentFixture<NicknameManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NicknameManagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NicknameManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
