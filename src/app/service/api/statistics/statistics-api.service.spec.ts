import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { StatisticsApiService } from './statistics-api.service';

describe('StatisticsApiService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatisticsApiService],
    });
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([StatisticsApiService], (service: StatisticsApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should get the base statistics', inject([StatisticsApiService], (service: StatisticsApiService) => {

    service.getBaseStatistics().subscribe();
    backend.expectOne(service.BASE_STATISTICS_GET_URL()).flush({});

    expect(service).toBeTruthy();
  }));

  it('should get the base statistics via OPTIONS request', inject([StatisticsApiService], (service: StatisticsApiService) => {

    service.optionsBaseStatistics().subscribe();
    backend.expectOne(service.BASE_STATISTICS_OPTIONS_URL()).flush({});

    expect(service).toBeTruthy();
  }));
});
