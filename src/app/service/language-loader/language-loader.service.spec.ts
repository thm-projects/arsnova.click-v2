import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { CasLoginService } from '../login/cas-login.service';
import { IndexedDbService } from '../storage/indexed.db.service';
import { StorageService } from '../storage/storage.service';
import { UserService } from '../user/user.service';

import { LanguageLoaderService } from './language-loader.service';

describe('LanguageLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LanguageLoaderService, CasLoginService, UserService, StorageService, IndexedDbService],
    });
  });

  it('should be created', inject([LanguageLoaderService], (service: LanguageLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
