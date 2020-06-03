import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { I18nTestingModule } from '../../../../../shared/testing/i18n-testing/i18n-testing.module';

import { ProgressBarRangedComponent } from './progress-bar-ranged.component';

describe('ProgressBarRangedComponent', () => {
  let component: ProgressBarRangedComponent;
  let fixture: ComponentFixture<ProgressBarRangedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, FontAwesomeModule,
      ],
      providers: [],
      declarations: [ProgressBarRangedComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faSpinner);
    fixture = TestBed.createComponent(ProgressBarRangedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', () => {
    expect(ProgressBarRangedComponent.TYPE).toEqual('ProgressBarRangedComponent');
  });

  it('#sanitizeStyle', () => {
    expect(component.sanitizeStyle('20%')).toBeTruthy();
  });

  it('#sanitizeHTML', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const markup = '<div><span>TestMarkup</span></div>';

    spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callFake((value: string) => value as string);
    component.sanitizeHTML(markup);
    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalled();
  }));
});
