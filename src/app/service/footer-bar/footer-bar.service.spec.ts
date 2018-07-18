import { async, inject, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';
import { IndexedDbService } from '../storage/indexed.db.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';

import { FooterBarService } from './footer-bar.service';

describe('FooterBarService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, FooterBarService,
      ],
    });
  }));

  it('should be created', async(inject([FooterBarService], (service: FooterBarService) => {
    expect(service).toBeTruthy();
  })));
});
