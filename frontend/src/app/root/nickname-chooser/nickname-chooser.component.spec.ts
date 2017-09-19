import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NicknameChooserComponent} from './nickname-chooser.component';

describe('NicknameChooserComponent', () => {
  let component: NicknameChooserComponent;
  let fixture: ComponentFixture<NicknameChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NicknameChooserComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NicknameChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
