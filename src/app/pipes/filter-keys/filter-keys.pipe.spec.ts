import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { I18nManagerService } from '../../service/api/i18n-manager/i18n-manager.service';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';
import { ProjectLoaderService } from '../../service/project-loader/project-loader.service';
import { FilterKeysPipe } from './filter-keys.pipe';

describe('FilterKeysPipe', () => {
  let pipe: FilterKeysPipe;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ], providers: [
        LanguageLoaderService, I18nManagerService, ProjectLoaderService,
      ], declarations: [
        FilterKeysPipe,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    pipe = new FilterKeysPipe(TestBed.get(LanguageLoaderService));
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
