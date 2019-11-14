import { LoginMechanism } from '../app/lib/enums/enums';
import { QuizTheme } from '../app/lib/enums/QuizTheme';
import { IEnvironment } from '../app/lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: true,
  version: 'VERSION',
  sentryDSN: 'https://f16c02fdefe64c018f5d580d1cf05b56@sentry.io/1819496',
  ssrEndpoint: 'https://beta.arsnova.click/backend',
  serverEndpoint: 'https://beta.arsnova.click/backend',
  httpApiEndpoint: 'https://beta.arsnova.click/backend/api/v1',
  httpLibEndpoint: 'https://beta.arsnova.click/backend/lib',
  stompConfig: {
    endpoint: 'wss://beta.arsnova.click/rabbitmq/ws',
    user: 'beta',
    password: 'beta',
    vhost: 'beta',
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
  availableQuizThemes: [QuizTheme.WestermannBlue, QuizTheme.Blackbeauty],
  defaultTheme: QuizTheme.WestermannBlue,
  darkModeCheckEnabled: false,
  claimSrc: '/assets/images/external/westermann-claim.png',
};

export enum DEVICE_TYPES {
  XS, SM, MD, LG, XLG
}

export enum LIVE_PREVIEW_ENVIRONMENT {
  ANSWEROPTIONS, QUESTION
}
