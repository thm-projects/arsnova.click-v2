import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { I18nTestingModule } from '../../../../../shared/testing/i18n-testing/i18n-testing.module';

import { ProgressBarAnonymousComponent } from './progress-bar-anonymous.component';

describe('ProgressBarAnonymousComponent', () => {
  let component: ProgressBarAnonymousComponent;
  let fixture: ComponentFixture<ProgressBarAnonymousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, FontAwesomeModule],
      providers: [],
      declarations: [ProgressBarAnonymousComponent],
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
