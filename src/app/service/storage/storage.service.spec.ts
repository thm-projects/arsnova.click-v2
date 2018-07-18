import { inject, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';
import { IndexedDbService } from './indexed.db.service';

import { StorageService } from './storage.service';
import { StorageServiceMock } from './storage.service.mock';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, StorageService, IndexedDbService,
      ],
    });
  });

  it('should be created', inject([StorageService], (service: StorageService) => {
    expect(service).toBeTruthy();
  }));
});
