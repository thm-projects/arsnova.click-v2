import { TranslateServiceMock } from '../../../_mocks/TranslateServiceMock';
import { GenericFilterPipe } from './generic-filter.pipe';

describe('GenericFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new GenericFilterPipe(new TranslateServiceMock());
    expect(pipe).toBeTruthy();
  });
});
