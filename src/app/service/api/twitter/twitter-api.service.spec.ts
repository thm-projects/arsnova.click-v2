import {TestBed} from '@angular/core/testing';
import {TwitterApiService} from './twitter-api.service';
import {I18nTestingModule} from '../../../shared/testing/i18n-testing/i18n-testing.module';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HttpClient} from '@angular/common/http';
import {SimpleMQ} from 'ng2-simple-mq';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MarkdownService, MarkedOptions} from 'ngx-markdown';

describe('TwitterApiService', () => {
    let service: TwitterApiService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [I18nTestingModule, FormsModule, RouterTestingModule, HttpClientTestingModule, FontAwesomeModule, NgbModule],
            providers: [TwitterApiService, SimpleMQ, MarkdownService, HttpClient, {
                provide: MarkedOptions,
                useValue: {},
            }]
        });
        service = TestBed.inject(TwitterApiService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

});
