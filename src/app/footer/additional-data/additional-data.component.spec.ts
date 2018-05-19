import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDataComponent } from './additional-data.component';
import {TrackingMockService} from '../../service/tracking.mock.service';
import {ActiveQuestionGroupMockService} from '../../service/active-question-group.mock.service';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {RouterTestingModule} from '@angular/router/testing';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {TrackingService} from '../../service/tracking.service';

describe('AdditionalDataComponent', () => {
  let component: AdditionalDataComponent;
  let fixture: ComponentFixture<AdditionalDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler
          }
        }),
      ],
      providers: [
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        {provide: TrackingService, useClass: TrackingMockService}
      ],
      declarations: [ AdditionalDataComponent ]
    })
    .compileComponents();
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
});
