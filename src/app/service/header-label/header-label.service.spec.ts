import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../_mocks/TranslateServiceMock';
import { HeaderLabelService } from './header-label.service';

describe('HeaderLabelService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        HeaderLabelService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
    });
  }));

  it('should be created', async(inject([HeaderLabelService], (service: HeaderLabelService) => {
    expect(service).toBeTruthy();
  })));
});
