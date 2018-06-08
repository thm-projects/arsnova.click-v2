import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';

import { AdditionalDataComponent } from './additional-data.component';

describe('AdditionalDataComponent', () => {
  let component: AdditionalDataComponent;
  let fixture: ComponentFixture<AdditionalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        { provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService },
        { provide: TrackingService, useClass: TrackingMockService },
      ],
      declarations: [AdditionalDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a TYPE definition', async(() => {
    expect(AdditionalDataComponent.TYPE).toEqual('AdditionalDataComponent');
  }));

  it('#switchShowMoreOrLess', () => {
    const baseState = window.innerWidth >= 768;
    expect(component.isShowingMore).toEqual(baseState);
    component.switchShowMoreOrLess();
    expect(component.isShowingMore).toEqual(!baseState);
  });
});
