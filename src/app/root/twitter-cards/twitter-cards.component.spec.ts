import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { LanguageFilterPipeMock } from '../../../_mocks/_pipes/LanguageFilterPipeMock';
import { TwitterApiService } from '../../service/api/twitter/twitter-api.service';
import { TwitterService } from '../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../service/twitter/twitter.service.mock';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { TwitterCardsComponent } from './twitter-cards.component';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipeMock implements PipeTransform {
  public transform(value: Array<any>, args?: string): Array<any> {
    return value;
  }
}


describe('TwitterCardsComponent', () => {
  let component: TwitterCardsComponent;
  let fixture: ComponentFixture<TwitterCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, FormsModule, RouterTestingModule, HttpClientTestingModule, FontAwesomeModule, NgbModule],
      declarations: [TwitterCardsComponent, SearchFilterPipeMock, LanguageFilterPipeMock],
      providers: [
        TwitterApiService, RxStompService, SimpleMQ, MarkdownService, {
          provide: MarkedOptions,
          useValue: {},
        }, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a TYPE reference', async(() => {
    expect(TwitterCardsComponent.TYPE).toEqual('TwitterCardsComponent');
  }));

});
