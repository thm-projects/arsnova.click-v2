import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { HeaderLabelService } from './header-label.service';

describe('HeaderLabelService', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [HeaderLabelService],
    });
  }));

  it('should be created', waitForAsync(inject([HeaderLabelService], (service: HeaderLabelService) => {
    expect(service).toBeTruthy();
  })));
});
