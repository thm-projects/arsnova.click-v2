import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SoundManagerComponent} from './sound-manager.component';

describe('SoundManagerComponent', () => {
  let component: SoundManagerComponent;
  let fixture: ComponentFixture<SoundManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [SoundManagerComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
