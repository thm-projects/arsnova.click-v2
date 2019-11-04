import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from '../../../../../../_mocks/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../../_mocks/TranslateServiceMock';

import { ProgressBarAnonymousComponent } from './progress-bar-anonymous.component';

describe('ProgressBarAnonymousComponent', () => {
  let component: ProgressBarAnonymousComponent;
  let fixture: ComponentFixture<ProgressBarAnonymousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      imports: [FontAwesomeModule],
      declarations: [ProgressBarAnonymousComponent, TranslatePipeMock],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarAnonymousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
