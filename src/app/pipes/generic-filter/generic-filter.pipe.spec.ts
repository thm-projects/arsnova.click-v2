import { TranslateServiceMock } from '../../../_mocks/_services/TranslateServiceMock';
import { GenericFilterPipe } from './generic-filter.pipe';

describe('GenericFilterPipe', () => {
  const stringMock = ['test1', 'test2'];
  const objectMock = [{ key: 'test1' }, { key: 'test2' }];

  it('create an instance', () => {
    const pipe = new GenericFilterPipe(new TranslateServiceMock());
    expect(pipe).toBeTruthy();
  });

  it('should return the original value if no args where provided', () => {
    const pipe = new GenericFilterPipe(new TranslateServiceMock());
    expect(pipe.transform(stringMock, {})).toEqual(stringMock);
  });

  it('should return a match by a string args', () => {
    const pipe = new GenericFilterPipe(new TranslateServiceMock());
    expect(pipe.transform(stringMock, 'test1').length).toEqual(1);
  });

  it('should return a match by an object as arg containing strings', () => {
    const pipe = new GenericFilterPipe(new TranslateServiceMock());
    expect(pipe.transform(objectMock, {
      $translateKeys: true,
      key: 'test1',
    }).length).toEqual(1);
  });
});
