import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { TranslatePipeMock } from '../../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../service/custom-markdown/CustomMarkdownServiceMock';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { TwitterService } from '../../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../../service/twitter/twitter.service.mock';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';
import { MemberGroupManagerComponent } from './member-group-manager.component';

describe('MemberGroupManagerComponent', () => {
  let component: MemberGroupManagerComponent;
  let fixture: ComponentFixture<MemberGroupManagerComponent>;

  beforeEach((
    () => {
      TestBed.configureTestingModule({
        imports: [
          I18nTestingModule,
          FormsModule, ReactiveFormsModule,
          HttpClientTestingModule, RouterTestingModule, FormsModule, FontAwesomeModule, JwtModule.forRoot({
            jwtOptionsProvider: {
              provide: JWT_OPTIONS,
              useFactory: jwtOptionsFactory,
              deps: [PLATFORM_ID],
            },
          }),
        ],
        providers: [
          RxStompService, SimpleMQ, FormBuilder, {
            provide: StorageService,
            useClass: StorageServiceMock,
          }, {
            provide: ThemesService,
            useClass: ThemesMockService
          }, FooterBarService, HeaderLabelService, {
            provide: QuizService,
            useClass: QuizMockService,
          }, SettingsService, {
            provide: ConnectionService,
            useClass: ConnectionMockService,
          }, {
            provide: TwitterService,
            useClass: TwitterServiceMock,
          }, {
            provide: CustomMarkdownService,
            useClass: CustomMarkdownServiceMock
          }
        ],
        declarations: [MemberGroupManagerComponent, TranslatePipeMock],
      }).compileComponents();
    }
  ));

  beforeEach((
    () => {
      const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
      library.addIcons(...[faTrash]);
      fixture = TestBed.createComponent(MemberGroupManagerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }
  ));

  beforeEach(() => {
    component.memberGroups.splice(0, component.memberGroups.length);
    component.memberGroups.push({name: 'Default', color: ''});
  });

  it('should create', (
    () => {
      expect(component).toBeTruthy();
    }
  ));

  it('should contain a TYPE reference', (
    () => {
      expect(MemberGroupManagerComponent.TYPE).toEqual('MemberGroupManagerComponent');
    }
  ));

  describe('#addMemberGroup', () => {

    it('should add a member group on valid input', (
      () => {
        component.formGroup.get('memberGroupName').setValue('testgroup');
        component.addMemberGroup();
        expect(component.memberGroups.length).toEqual(1);
      }
    ));
    it('should not add a member group on invalid input', (
      () => {
        component.formGroup.get('memberGroupName').setValue('');
        component.addMemberGroup();
        expect(component.memberGroups.length).toEqual(1);
      }
    ));
    it('should not add an existing member group', (
      () => {
        component.formGroup.get('memberGroupName').setValue('testgroup');
        component.addMemberGroup();
        component.addMemberGroup();
        expect(component.memberGroups.length).toEqual(1);
      }
    ));
  });

  describe('#removeMemberGroup', () => {

    it('should remove an existing member group', (
      () => {
        component.removeMemberGroup('Default');
        expect(component.memberGroups.length).toEqual(0);
      }
    ));
    it('should not remove a not existing member group', (
      () => {
        component.removeMemberGroup('notexisting');
        expect(component.memberGroups.length).toEqual(1);
      }
    ));
  });
});
