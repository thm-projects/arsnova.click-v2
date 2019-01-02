import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { IndexedDbService } from '../../../service/storage/indexed.db.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { SharedModule } from '../../../shared/shared.module';

import { MemberGroupManagerComponent } from './member-group-manager.component';

describe('MemberGroupManagerComponent', () => {
  let component: MemberGroupManagerComponent;
  let fixture: ComponentFixture<MemberGroupManagerComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, SharedModule, RouterTestingModule, HttpClientModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }), FormsModule,
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, FooterBarService, HeaderLabelService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        },
      ],
      declarations: [MemberGroupManagerComponent],
    }).compileComponents();
  }));

  beforeEach((() => {
    fixture = TestBed.createComponent(MemberGroupManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  beforeEach(() => {
    component.memberGroups.splice(0, component.memberGroups.length);
    component.memberGroups.push('Default');
  });

  it('should create', (() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', (() => {
    expect(MemberGroupManagerComponent.TYPE).toEqual('MemberGroupManagerComponent');
  }));

  describe('#addMemberGroup', () => {

    it('should add a member group on valid input', (() => {
      component.memberGroupName = 'testgroup';
      component.addMemberGroup();
      expect(component.memberGroups.length).toEqual(2);
    }));
    it('should not add a member group on invalid input', (() => {
      component.memberGroupName = '';
      component.addMemberGroup();
      expect(component.memberGroups.length).toEqual(1);
    }));
    it('should not add an existing member group', (() => {
      component.memberGroupName = 'testgroup';
      component.addMemberGroup();
      component.addMemberGroup();
      expect(component.memberGroups.length).toEqual(2);
    }));
  });

  describe('#removeMemberGroup', () => {

    it('should remove an existing member group', (() => {
      component.removeMemberGroup('Default');
      expect(component.memberGroups.length).toEqual(0);
    }));
    it('should not remove a not existing member group', (() => {
      component.removeMemberGroup('notexisting');
      expect(component.memberGroups.length).toEqual(1);
    }));
  });
});
