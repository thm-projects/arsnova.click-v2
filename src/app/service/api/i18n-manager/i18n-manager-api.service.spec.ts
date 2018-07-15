import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { I18nManagerApiService } from './i18n-manager-api.service';

describe('I18nManagerService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [I18nManagerApiService],
    });
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([I18nManagerApiService], (service: I18nManagerApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should get the language file for the frontend project', inject([I18nManagerApiService], (service: I18nManagerApiService) => {

    service.getLangFileForFE().subscribe();
    backend.expectOne(service.GET_LANG_FILE_URL(service.GET_FE_PROJECT_URL()));

    expect(service).toBeTruthy();
  }));

  it('should get the language file for the backend project', inject([I18nManagerApiService], (service: I18nManagerApiService) => {

    service.getLangFileForBE().subscribe();
    backend.expectOne(service.GET_LANG_FILE_URL(service.GET_BE_PROJECT_URL()));

    expect(service).toBeTruthy();
  }));

  it('should post the updated language file for the frontend project', inject([I18nManagerApiService], (service: I18nManagerApiService) => {

    const data = [];

    service.postUpdateLangForFE(data).subscribe();
    backend.expectOne(service.POST_UPDATE_PROJECT_URL(service.GET_FE_PROJECT_URL()));

    expect(service).toBeTruthy();
  }));

  it('should post the updated language file for the backend project', inject([I18nManagerApiService], (service: I18nManagerApiService) => {

    const data = [];

    service.postUpdateLangForBE(data).subscribe();
    backend.expectOne(service.POST_UPDATE_PROJECT_URL(service.GET_BE_PROJECT_URL()));

    expect(service).toBeTruthy();
  }));
});
