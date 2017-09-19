export class NotYetImplementedException extends Error {
  private static DEFAULT_MESSAGE = 'NOT YET IMPLEMENTED!';

  constructor(message?: string) {
    super(message || NotYetImplementedException.DEFAULT_MESSAGE);
  }
}
