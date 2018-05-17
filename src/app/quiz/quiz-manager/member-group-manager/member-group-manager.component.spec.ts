import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberGroupManagerComponent } from './member-group-manager.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {FooterBarService} from '../../../service/footer-bar.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {FormsModule} from '@angular/forms';
import {SettingsService} from '../../../service/settings.service';
import {ConnectionService} from '../../../service/connection.service';
import {ConnectionMockService} from '../../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../../service/active-question-group.mock.service';

describe('MemberGroupManagerComponent', () => {
  let component: MemberGroupManagerComponent;
  let fixture: ComponentFixture<MemberGroupManagerComponent>;

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
        FormsModule
      ],
      providers: [
        FooterBarService,
        HeaderLabelService,
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
      ],
      declarations: [ MemberGroupManagerComponent ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MemberGroupManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
