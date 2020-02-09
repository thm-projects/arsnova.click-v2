import { SecurityContext } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { TranslatePipeMock } from '../../../../../../_mocks/_pipes/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../../../_mocks/_services/TranslateServiceMock';

import { ProgressBarMultipleChoiceComponent } from './progress-bar-multiple-choice.component';

describe('ProgressBarMultipleChoiceComponent', () => {
  let component: ProgressBarMultipleChoiceComponent;
  let fixture: ComponentFixture<ProgressBarMultipleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FontAwesomeModule,
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      declarations: [ProgressBarMultipleChoiceComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faSpinner);
    fixture = TestBed.createComponent(ProgressBarMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', () => {
    expect(ProgressBarMultipleChoiceComponent.TYPE).toEqual('ProgressBarMultipleChoiceComponent');
  });

  it('#sanitizeStyle', () => {
    expect(component.sanitizeStyle('20%')).toBeTruthy();
  });

  it('#sanitizeHTML', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const markup = '<div><span>TestMarkup</span></div>';

    spyOn(sanitizer, 'sanitize').and.callFake((ctx: SecurityContext, value: string) => value as string);
    component.sanitizeHTML(markup);
    expect(sanitizer.sanitize).toHaveBeenCalled();
  }));
});
