import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ThemesApiService } from './themes-api.service';

describe('ThemesApiService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ThemesApiService],
    });
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([ThemesApiService], (service: ThemesApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should get the meta link tags of the current theme', inject([ThemesApiService], (service: ThemesApiService) => {

    const theme = 'theme-Material';

    service.getLinkImages(theme).subscribe();
    backend.expectOne(service.THEMES_LINK_IMAGES_GET_URL(theme)).flush({});

    expect(service).toBeTruthy();
  }));
});
