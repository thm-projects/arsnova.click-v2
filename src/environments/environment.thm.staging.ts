import { LoginMechanism, Title } from '../app/lib/enums/enums';
import { QuizTheme } from '../app/lib/enums/QuizTheme';
import { IEnvironment } from '../app/lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: true,
  title: Title.Default,
  version: 'VERSION',
  enableCasLogin: false,
  sentryDSN: 'https://14415a5e358f4c04b6a878072d352c4e@sentry.arsnova.click/2',
  ssrEndpoint: 'https://staging.arsnova.click/backend',
  serverEndpoint: 'https://staging.arsnova.click/backend',
  httpApiEndpoint: 'https://staging.arsnova.click/backend/api/v1',
  httpLibEndpoint: 'https://staging.arsnova.click/backend/lib',
  stompConfig: {
    endpoint: 'wss://staging.arsnova.click/rabbitmq/ws',
    user: 'arsnova-click',
    password: 'K3BHZQMHsxh6XQ5a',
    vhost: '/',
  },
  leaderboardAmount: 5,
  readingConfirmationEnabled: true,
  confidenceSliderEnabled: true,
  infoAboutTabEnabled: true,
  infoProjectTabEnabled: true,
  infoBackendApiEnabled: true,
  requireLoginToCreateQuiz: false,
  forceQuizTheme: false,
  loginMechanism: [LoginMechanism.UsernamePassword],
  showJoinableQuizzes: true,
  showPublicQuizzes: true,
  persistQuizzes: true,
  availableQuizThemes: [
    QuizTheme.Material,
    QuizTheme.ArsnovaDotClickContrast,
    QuizTheme.Blackbeauty,
    QuizTheme.Elegant,
    QuizTheme.DecentBlue,
    QuizTheme.MaterialHope,
    QuizTheme.MaterialBlue,
    QuizTheme.SpiritualPurple,
    QuizTheme.GreyBlueLime,
  ],
  defaultTheme: QuizTheme.Material,
  darkModeCheckEnabled: true,
  enableTwitter: true,
  enableQuizPool: true,
  vapidPublicKey: 'BFy8kQxiV2p43Z8Xqs6isn7QRVDEvkqreDH3wH0QlDLDn8cZkbM41iOWwxUBsw_R0Y4Bv8AkI9sKj82P18q41z0',
};

export enum DEVICE_TYPES {
  XS, SM, MD, LG, XLG
}

export enum LIVE_PREVIEW_ENVIRONMENT {
  ANSWEROPTIONS, QUESTION
}
