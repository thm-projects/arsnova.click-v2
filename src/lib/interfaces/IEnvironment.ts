import { LoginMechanism } from '../enums/enums';

export interface IEnvironment {
  production: boolean;
  ssrEndpoint: string;
  serverEndpoint: string;
  httpApiEndpoint: string;
  httpLibEndpoint: string;
  stompConfig: {
    endpoint: string, user: string, password: string,
  };
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
