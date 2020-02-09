import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';

import { I18nService } from './i18n.service';

describe('I18nService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, HttpClientTestingModule, RouterTestingModule,
      ],
      providers: [
        {
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
