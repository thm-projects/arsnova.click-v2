import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { ProgressBarSurveyComponent } from './progress-bar-survey.component';

describe('ProgressBarSurveyComponent', () => {
  let component: ProgressBarSurveyComponent;
  let fixture: ComponentFixture<ProgressBarSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarSurveyComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProgressBarSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', () => {
    expect(ProgressBarSurveyComponent.TYPE).toEqual('ProgressBarSurveyComponent');
  });

  it('#sanitizeStyle', () => {
    expect(component.sanitizeStyle('20%')).toBeTruthy();
  });

  it('#sanitizeHTML', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const markup = '<div><span>TestMarkup</span></div>';

    spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callFake(() => {});
    component.sanitizeHTML(markup);
    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalled();
  }));
});