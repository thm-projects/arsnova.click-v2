import { LoginMechanism, Title } from '../app/lib/enums/enums';
import { QuizTheme } from '../app/lib/enums/QuizTheme';
import { IEnvironment } from '../app/lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: true,
  title: Title.Default,
  version: 'VERSION',
  enableCasLogin: false,
  sentryDSN: 'https://14415a5e358f4c04b6a878072d352c4e@sentry.arsnova.click/2',
  ssrEndpoint: 'https://arsnova.click/backend',
  serverEndpoint: 'https://arsnova.click/backend',
  httpApiEndpoint: 'https://arsnova.click/backend/api/v1',
  httpLibEndpoint: 'https://arsnova.click/backend/lib',
  stompConfig: {
    endpoint: 'wss://arsnova.click/rabbitmq/ws',
    user: 'arsnova-click',
    password: 'K3BHZQMHsxh6XQ5a',
    vhost: '/',
  },
  leaderboardAmount: 10,
  readingConfirmationEnabled: false,
  confidenceSliderEnabled: false,
  infoAboutTabEnabled: true,
  infoProjectTabEnabled: true,
  infoBackendApiEnabled: true,
  requireLoginToCreateQuiz: false,
  enableBonusToken: true,
  forceQuizTheme: false,
  loginMechanism: [LoginMechanism.UsernamePassword],
  showLoginButton: false,
  showJoinableQuizzes: true,
  showPublicQuizzes: true,
  persistQuizzes: true,
  availableQuizThemes: [
    QuizTheme.Material,
    QuizTheme.Blackbeauty,
  ],
  defaultTheme: QuizTheme.Material,
  darkModeCheckEnabled: true,
  enableTwitter: true,
  enableQuizPool: true,
  vapidPublicKey: 'BFy8kQxiV2p43Z8Xqs6isn7QRVDEvkqreDH3wH0QlDLDn8cZkbM41iOWwxUBsw_R0Y4Bv8AkI9sKj82P18q41z0',
};
