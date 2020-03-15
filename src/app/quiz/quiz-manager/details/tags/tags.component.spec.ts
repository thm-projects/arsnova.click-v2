import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { TranslatePipeMock } from '../../../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { CustomMarkdownService } from '../../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../../service/custom-markdown/CustomMarkdownServiceMock';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';

import { TagsComponent } from './tags.component';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, I18nTestingModule, HttpClientTestingModule, RouterTestingModule, NgbTypeaheadModule, JwtModule.forRoot({
        jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
          deps: [PLATFORM_ID],
        },
      })],
      providers: [RxStompService, SimpleMQ, {
        provide: CustomMarkdownService,
        useClass: CustomMarkdownServiceMock,
      }],
      declarations: [ TagsComponent, TranslatePipeMock ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
