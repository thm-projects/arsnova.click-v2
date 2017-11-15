import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizLobbyComponent} from './quiz-lobby.component';

describe('QuizLobbyComponent', () => {
  let component: QuizLobbyComponent;
  let fixture: ComponentFixture<QuizLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuizLobbyComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
