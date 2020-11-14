import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GamificationAnimationComponent } from './gamification-animation.component';

describe('GamificationAnimationComponent', () => {
  let component: GamificationAnimationComponent;
  let fixture: ComponentFixture<GamificationAnimationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GamificationAnimationComponent],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(GamificationAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', waitForAsync(() => {
    expect(GamificationAnimationComponent.TYPE).toEqual('GamificationAnimationComponent');
  }));
});
