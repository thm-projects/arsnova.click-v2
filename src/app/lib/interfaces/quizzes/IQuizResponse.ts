export interface IQuizResponse {
  value: Array<number> | string;
  responseTime: number;
  confidence: number;
  readingConfirmation: boolean;
}
