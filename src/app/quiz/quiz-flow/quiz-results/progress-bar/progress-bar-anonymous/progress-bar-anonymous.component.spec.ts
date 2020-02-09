import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from '../../../../../../_mocks/_pipes/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../../_mocks/_services/TranslateServiceMock';

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
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faSpinner);
    fixture = TestBed.createComponent(ProgressBarAnonymousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
