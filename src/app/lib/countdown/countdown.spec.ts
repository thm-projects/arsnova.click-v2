import { Countdown } from './countdown';

describe('Countdown', () => {
  let countdown: Countdown;

  beforeEach(() => {
    countdown = new Countdown(10);
  });

  it('should create', () => {
    expect(countdown).toBeTruthy();
  });

  it('should run the countdown', done => {
    expect(countdown.isRunning).toBeTruthy();
    countdown.onChange.subscribe(val => {
      expect(countdown.remainingTime).toEqual(val);
      clearInterval(countdown['_interval']);
      done();
    });
  });

  it('should stop the countdown', () => {
    countdown.stop();
    expect(countdown.remainingTime).toEqual(0);
    expect(countdown.isRunning).toEqual(false);
    expect(countdown.hasFinished).toEqual(true);
  });
});
