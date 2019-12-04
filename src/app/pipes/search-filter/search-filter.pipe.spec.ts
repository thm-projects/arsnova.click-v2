import { SearchFilterPipe } from './search-filter.pipe';

describe('SearchFilterPipe', () => {
  const objectMock = [{ key: 'find-me' }, { key: 'dont find me' }];
  const stringMock = [
    'this is a long test but it will be found since it includes find-me',
    'this is a long test but it will wont be found since it does not include find me',
  ];

  it('create an instance', () => {
    const pipe = new SearchFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should find a key in an object', () => {
    const pipe = new SearchFilterPipe();
    expect(pipe.transform(objectMock, 'find-me').length).toEqual(1);
  });

  it('should not find a non-matching key in an object', () => {
    const pipe = new SearchFilterPipe();
    expect(pipe.transform(objectMock, 'dont-find-me').length).toEqual(0);
  });

  it('should find a key in a string', () => {
    const pipe = new SearchFilterPipe();
    expect(pipe.transform(stringMock, 'find-me').length).toEqual(1);
  });

  it('should not find a non-matching string', () => {
    const pipe = new SearchFilterPipe();
    expect(pipe.transform(stringMock, 'dont-find-me').length).toEqual(0);
  });
});
