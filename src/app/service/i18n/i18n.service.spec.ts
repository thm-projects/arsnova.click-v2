import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../_mocks/_services/TranslateServiceMock';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';

import { I18nService } from './i18n.service';

describe('I18nService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule,
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, I18nService,
      ],
    });
  }));

  it('should be created', async(inject([I18nService], (service: I18nService) => {
    expect(service).toBeTruthy();
  })));
});
