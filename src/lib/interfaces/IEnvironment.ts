import { LoginMechanism } from '../enums/enums';

export interface IEnvironment {
  production: boolean;
  ssrEndpoint: string;
  serverEndpoint: string;
  httpApiEndpoint: string;
  httpLibEndpoint: string;
  stompEndpoint: string;
  leaderboardAmount: number;
  readingConfirmationEnabled: boolean;
  confidenceSliderEnabled: boolean;
  infoAboutTabEnabled: boolean;
  infoProjectTabEnabled: boolean;
  infoBackendApiEnabled: boolean;
  requireLoginToCreateQuiz: boolean;
  forceQuizTheme: boolean;
  loginMechanism: Array<LoginMechanism>;
}
