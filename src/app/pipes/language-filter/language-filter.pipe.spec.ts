import { TranslateServiceMock } from '../../../_mocks/_services/TranslateServiceMock';
import { I18nService } from '../../service/i18n/i18n.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { LanguageFilterPipe } from './language-filter.pipe';

describe('LanguageFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new LanguageFilterPipe(new I18nService({}, new TranslateServiceMock(), new StorageServiceMock() as unknown as StorageService));
    expect(pipe).toBeTruthy();
  });
});
