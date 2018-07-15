import { inject, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';
import { IndexedDbService } from './indexed.db.service';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [StorageService, IndexedDbService],
    });
  });

  it('should be created', inject([StorageService], (service: StorageService) => {
    expect(service).toBeTruthy();
  }));
});
