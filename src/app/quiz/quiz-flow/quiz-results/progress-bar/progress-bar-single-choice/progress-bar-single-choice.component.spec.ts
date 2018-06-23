import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedModule } from '../../../../../shared/shared.module';

import { ProgressBarSingleChoiceComponent } from './progress-bar-single-choice.component';

describe('ProgressBarSingleChoiceComponent', () => {
  let component: ProgressBarSingleChoiceComponent;
  let fixture: ComponentFixture<ProgressBarSingleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [ProgressBarSingleChoiceComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProgressBarSingleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', () => {
    expect(ProgressBarSingleChoiceComponent.TYPE).toEqual('ProgressBarSingleChoiceComponent');
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
