import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { HeaderLabelService } from './header-label.service';

describe('HeaderLabelService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [HeaderLabelService],
    });
  }));

  it('should be created', async(inject([HeaderLabelService], (service: HeaderLabelService) => {
    expect(service).toBeTruthy();
  })));
});
