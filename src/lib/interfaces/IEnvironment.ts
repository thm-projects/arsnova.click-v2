import { LoginMechanism } from '../enums/enums';

export interface IEnvironment {
  production: boolean;
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
