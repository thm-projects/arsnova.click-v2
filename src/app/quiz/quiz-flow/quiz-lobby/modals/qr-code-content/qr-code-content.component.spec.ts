import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angular2-qrcode';
import { QuizService } from '../../../../../service/quiz/quiz.service';

import { QrCodeContentComponent } from './qr-code-content.component';

describe('QrCodeContentComponent', () => {
  let component: QrCodeContentComponent;
  let fixture: ComponentFixture<QrCodeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [QRCodeModule],
      providers: [
        {
          provide: QuizService,
          useValue: {
            quiz: {
              name: 'testquiz',
            },
          },
        }, NgbActiveModal,
      ],
      declarations: [QrCodeContentComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
