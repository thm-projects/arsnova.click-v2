import { inject, TestBed } from '@angular/core/testing';
import { IndexedDbService } from './indexed.db.service';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        StorageService, IndexedDbService,
      ],
    });
  });

  it('should be created', inject([StorageService], (service: StorageService) => {
    expect(service).toBeTruthy();
  }));
});
