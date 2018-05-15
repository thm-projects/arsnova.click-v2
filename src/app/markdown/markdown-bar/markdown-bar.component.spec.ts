import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkdownBarComponent} from './markdown-bar.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {TrackingService} from '../../service/tracking.service';
import {ArsnovaClickAngulartics2Piwik} from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {Angulartics2Module} from 'angulartics2';
import {RouterTestingModule} from '@angular/router/testing';
import {TrackingMockService} from '../../service/tracking.mock.service';

describe('MarkdownBarComponent', () => {
  let component: MarkdownBarComponent;
  let fixture: ComponentFixture<MarkdownBarComponent>;

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
        {provide: TrackingService, useClass: TrackingMockService},
      ],
      declarations: [MarkdownBarComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MarkdownBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
