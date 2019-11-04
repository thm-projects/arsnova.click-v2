import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { UserService } from '../../service/user/user.service';

import { QuizDetailsAdminComponent } from './quiz-details-admin.component';

describe('QuizDetailsAdminComponent', () => {
  let component: QuizDetailsAdminComponent;
  let fixture: ComponentFixture<QuizDetailsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: FooterBarService,
          useValue: {
            replaceFooterElements: () => {},
          },
        }, {
          provide: UserService,
          useValue: {},
        },
      ],
      declarations: [QuizDetailsAdminComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
