import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MathjaxApiService } from './mathjax-api.service';

describe('MathjaxApiService', () => {
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MathjaxApiService],
    });
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', inject([MathjaxApiService], (service: MathjaxApiService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', inject([MathjaxApiService], (service: MathjaxApiService) => {

    const mathjaxData = {};

    service.postMathjax(mathjaxData).subscribe();
    backend.expectOne(service.MATHJAX_POST_URL()).flush([{}]);

    expect(service).toBeTruthy();
  }));
});
