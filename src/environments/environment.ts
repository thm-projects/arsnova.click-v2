import { LoginMechanism, Title } from '../app/lib/enums/enums';
import { QuizTheme } from '../app/lib/enums/QuizTheme';
import { IEnvironment } from '../app/lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: false,
  title: Title.Westermann,
  version: 'VERSION',
  enableCasLogin: true,
  sentryDSN: 'https://f16c02fdefe64c018f5d580d1cf05b56@sentry.io/1819496',
  ssrEndpoint: 'http://localhost:4000',
  serverEndpoint: 'http://localhost:3010',
  httpApiEndpoint: 'http://localhost:3010/api/v1',
  httpLibEndpoint: 'http://localhost:3010/lib',
  stompConfig: {
    endpoint: 'ws://localhost:15674/ws',
    user: 'arsnova-click',
    password: 'K3BHZQMHsxh6XQ5a',
    vhost: '/',
  },
  leaderboardAmount: 5,
  readingConfirmationEnabled: false,
  confidenceSliderEnabled: false,
  infoAboutTabEnabled: false,
  infoProjectTabEnabled: false,
  infoBackendApiEnabled: false,
  requireLoginToCreateQuiz: true,
  forceQuizTheme: true,
  loginMechanism: [LoginMechanism.UsernamePassword, LoginMechanism.Token],
  showJoinableQuizzes: false,
  showPublicQuizzes: false,
  persistQuizzes: false,
  availableQuizThemes: [QuizTheme.WestermannBlue, QuizTheme.Material, QuizTheme.Blackbeauty],
  defaultTheme: QuizTheme.WestermannBlue,
  darkModeCheckEnabled: true,
};

export enum DEVICE_TYPES {
  XS, SM, MD, LG, XLG
}

export enum LIVE_PREVIEW_ENVIRONMENT {
  ANSWEROPTIONS, QUESTION
}
