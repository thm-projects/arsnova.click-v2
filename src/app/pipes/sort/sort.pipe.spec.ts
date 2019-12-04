import { SortPipe } from './sort.pipe';

describe('SortPipe', () => {
  const objectMock = [{ key: 'sort-2' }, { key: 'sort-1' }];

  it('create an instance', () => {
    const pipe = new SortPipe();
    expect(pipe).toBeTruthy();
  });

  it('should sort an object by the "key" property ascending', () => {
    const pipe = new SortPipe();
    expect(pipe.transform(objectMock)[0].key).toEqual('sort-1');
  });
});
