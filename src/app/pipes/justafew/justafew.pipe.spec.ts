import { JustAFewPipe } from './justafew.pipe';

describe('JustafewPipe', () => {
  const mock: Array<number> = Array(5).fill(5);
  const maxLength = 2;

  it('create an instance', () => {
    const pipe = new JustAFewPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return the original value if no limiter was provided', () => {
    const pipe = new JustAFewPipe();
    expect(pipe.transform(mock, 0)).toEqual(mock);
  });

  it('should return a subset of the value with a length of maxLength', () => {
    const pipe = new JustAFewPipe();
    expect(pipe.transform(mock, maxLength).length).toEqual(maxLength);
  });
});
