import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamificationAnimationComponent } from './gamification-animation.component';

describe('GamificationAnimationComponent', () => {
  let component: GamificationAnimationComponent;
  let fixture: ComponentFixture<GamificationAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GamificationAnimationComponent],
    })
           .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GamificationAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
