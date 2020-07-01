import { LoginMechanism, Title } from '../enums/enums';
import { QuizTheme } from '../enums/QuizTheme';

export interface IEnvironment {
  enableBonusToken: boolean;
  vapidPublicKey: string;
  title: Title;
  enableCasLogin: boolean;
  sentryDSN?: string;
  version: string;
  production: boolean;
  serverEndpoint: string;
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
  showLoginButton: boolean;
  persistQuizzes: boolean;
  availableQuizThemes: Array<QuizTheme>;
  defaultTheme: QuizTheme;
  darkModeCheckEnabled: boolean;
  enableTwitter: boolean;
  enableQuizPool: boolean;
  showInfoButtonsInFooter: boolean;
}
