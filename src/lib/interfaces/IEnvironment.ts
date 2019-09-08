import { LoginMechanism } from '../enums/enums';

export interface IEnvironment {
  production: boolean;
  ssrEndpoint: string;
  serverEndpoint: string;
  httpApiEndpoint: string;
  httpLibEndpoint: string;
  stompConfig: {
    endpoint: string, user: string, password: string, vhost: string,
  };
  leaderboardAmount: number;
  readingConfirmationEnabled: boolean;
  confidenceSliderEnabled: boolean;
  infoAboutTabEnabled: boolean;
  infoProjectTabEnabled: boolean;
  infoBackendApiEnabled: boolean;
  requireLoginToCreateQuiz: boolean;
  showJoinableQuizzes: boolean;
  showPublicQuizzes: boolean;
  forceQuizTheme: boolean;
  loginMechanism: Array<LoginMechanism>;
}
