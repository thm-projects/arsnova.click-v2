import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { JustafewPipeMock } from '../../../../_mocks/_pipes/JustafewPipeMock';
import { TranslatePipeMock } from '../../../../_mocks/_pipes/TranslatePipeMock';
import { TranslateServiceMock } from '../../../../_mocks/_services/TranslateServiceMock';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { NicknameManagerComponent } from './nickname-manager.component';

describe('NicknameManagerComponent', () => {
  let component: NicknameManagerComponent;
  let fixture: ComponentFixture<NicknameManagerComponent>;

  const nicknames = {
    disney: [
      'Donald Duck',
      'Daisy Duck',
      'Tarzan',
      'Simba',
      'Elsa',
      'Anna',
      'Kuzco',
      'Arielle',
      'Jasmin',
      'Mulan',
      'Pluto',
      'Nemo',
      'Buzz Lightyear',
      'Woody',
      'Lightning McQueen',
      'Tinkerbell',
      'Peter Pan',
      'Cinderella',
      'Dagobert Duck',
      'Goofy',
    ],
    science: [],
    fantasy: [],
    literature: [],
    mythology: [],
    actor: [],
    politics: [],
    turing_award: [],
    emojis: [],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }), InfiniteScrollModule,
      ],
      providers: [
        MarkdownService, {
          provide: MarkedOptions,
          useValue: {},
        },
        RxStompService,
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      declarations: [NicknameManagerComponent, TranslatePipeMock, JustafewPipeMock],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NicknameManagerComponent);
    component = fixture.componentInstance;
    component.availableNicks = JSON.parse(JSON.stringify(nicknames));
    fixture.detectChanges();
  }));

  beforeEach(inject([QuizService], (quizService: QuizService) => {
    quizService.quiz.sessionConfig.nicks.selectedNicks.splice(0, quizService.quiz.sessionConfig.nicks.selectedNicks.length);
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(NicknameManagerComponent.TYPE).toEqual('NicknameManagerComponent');
  }));

  describe('filterForKeyword', () => {

    afterEach(() => {
      const removeFilterEvent = <any>{ target: { value: '' } };
      component.filterForKeyword(removeFilterEvent);
      expect(component.availableNicks.disney.length).toEqual(nicknames.disney.length);
    });

    it('should filter the nicknames for a given keyword', () => {
      const value = 'Tarzan';
      const event = <any>{ target: { value } };

      component.filterForKeyword(event);
      expect(component.availableNicks.disney.length).toEqual(1);
      expect(component.availableNicks.disney[0]).toEqual(value);
    });
  });

  describe('#sanitizeHTML', () => {

    it('should sanitize the html input', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
      const markup = '<div><span>TestMarkup</span></div>';

      spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callFake(value => value);
      component.sanitizeHTML(markup);
      expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalled();
    }));
  });

  describe('#availableNickCategories', () => {

    it('should list all available categories', () => {
      const categories = component.availableNickCategories();
      expect(categories)
      .toEqual(
        jasmine.arrayWithExactContents(['disney', 'science', 'fantasy', 'literature', 'mythology', 'actor', 'politics', 'turing_award', 'emojis']));
    });
  });

  describe('#toggleSelectedCategory', () => {

    it('should set a given category as active', () => {
      component.toggleSelectedCategory('disney');
      expect(component.selectedCategory).toEqual('disney');
    });

    it('should not set an invalid category as active', () => {
      component.toggleSelectedCategory('notexisting');
      expect(component.selectedCategory).toEqual('');
    });
  });

  describe('#selectNick', () => {

    it('should select a given nickname', inject([QuizService], (quizService: QuizService) => {
      const nick = 'Tarzan';

      component.selectNick(nick);
      quizService.quiz.sessionConfig.nicks.selectedNicks.push(nick);
      expect(quizService.quiz.sessionConfig.nicks.selectedNicks).toContain(nick);
    }));
  });

  describe('#hasSelectedNick', () => {

    it('should return true if a given nickname has been selected', inject([QuizService], (quizService: QuizService) => {
      const nick = 'Tarzan';
      component.selectNick(nick);
      quizService.quiz.sessionConfig.nicks.selectedNicks.push(nick);
      const result = component.hasSelectedNick(nick);

      expect(result).toBeTruthy();
    }));

    it('should return false if nickname which is not selected has been given', () => {
      const nick = 'NotExsting';
      const result = component.hasSelectedNick(nick);

      expect(result).toBeFalsy();
    });
  });

  describe('#hasSelectedCategory', () => {

    it('should return true if a given category has been selected', () => {
      const category = 'disney';
      component.toggleSelectedCategory(category);
      const result = component.hasSelectedCategory(category);

      expect(result).toBeTruthy();
    });

    it('should return false if a category which is not selected has been given', () => {
      const category = 'NotExisting';
      const result = component.hasSelectedCategory(category);

      expect(result).toBeFalsy();
    });
  });

  describe('#hasSelectedAllNicks', () => {

    it('should return true if all nicks of a category have been selected', inject([QuizService], (quizService: QuizService) => {
      spyOnProperty(component, 'selectedCategory').and.returnValue('disney');
      component.availableNicks.disney.forEach(nick => {
        component.selectNick(nick);
        quizService.quiz.sessionConfig.nicks.selectedNicks.push(nick);
      });

      expect(component.hasSelectedAllNicks()).toBeTruthy();
    }));

    it('should return false if not all nicks of a category have been selected', () => {
      spyOnProperty(component, 'selectedCategory').and.returnValue('disney');

      expect(component.availableNicks.disney).toEqual(jasmine.arrayWithExactContents(nicknames.disney));
      component.selectNick(component.availableNicks.disney[0]);
      expect(component.hasSelectedAllNicks()).toBeFalsy();
    });
  });

  describe('#getNumberOfSelectedNicksOfCategory', () => {

    it('should return the number of selected nicks of a given category', inject([QuizService], (quizService: QuizService) => {
      component.selectNick(component.availableNicks.disney[0]);
      quizService.quiz.sessionConfig.nicks.selectedNicks.push(component.availableNicks.disney[0]);

      expect(component.getNumberOfSelectedNicksOfCategory('disney')).toEqual(1);
      expect(component.getNumberOfSelectedNicksOfCategory('notSelected')).toEqual(0);
    }));
  });

  describe('#getNumberOfAvailableNicksForCategory', () => {

    it('should return the number of available nicks for a given category', () => {

      expect(component.getNumberOfAvailableNicksForCategory('disney')).toEqual(nicknames.disney.length);
      expect(component.getNumberOfAvailableNicksForCategory('notSelected')).toEqual(0);
    });
  });

  describe('#toggleAllNicks', () => {

    it('should select all nicks of a given category if not all nicks are selected', inject([QuizService], (quizService: QuizService) => {
      spyOn(component, 'hasSelectedAllNicks').and.callFake(() => false);
      spyOnProperty(component, 'selectedCategory').and.returnValue('disney');

      component.toggleAllNicks();
      quizService.quiz.sessionConfig.nicks.selectedNicks.push(...component.availableNicks.disney);

      const selectedNicksLength = quizService.quiz.sessionConfig.nicks.selectedNicks.length;
      expect(selectedNicksLength).toEqual(nicknames.disney.length);
    }));

    it('should deselect all nicks of a given category if all nicks have been selected', inject([QuizService], (quizService: QuizService) => {
      spyOn(component, 'hasSelectedAllNicks').and.callFake(() => true);
      spyOnProperty(component, 'selectedCategory').and.returnValue('disney');

      component.toggleAllNicks();
      quizService.quiz.sessionConfig.nicks.selectedNicks = [];

      const selectedNicksLength = quizService.quiz.sessionConfig.nicks.selectedNicks.length;
      expect(selectedNicksLength).toEqual(0);
    }));
  });
});
