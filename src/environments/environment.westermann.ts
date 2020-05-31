import { LoginMechanism, Title } from '../app/lib/enums/enums';
import { QuizTheme } from '../app/lib/enums/QuizTheme';
import { IEnvironment } from '../app/lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: true,
  title: Title.Westermann,
  enableCasLogin: false,
  version: 'VERSION',
  ssrEndpoint: 'https://test01.ars.sbzo.de',
  serverEndpoint: 'https://test01.ars.sbzo.de/backend/',
  httpApiEndpoint: 'https://test01.ars.sbzo.de/backend/api/v1/',
  httpLibEndpoint: 'https://test01.ars.sbzo.de/backend/lib',
  stompConfig: {
    endpoint: 'wss://test01.ars.sbzo.de/rabbitmq/ws',
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
  availableQuizThemes: [QuizTheme.WestermannBlue, QuizTheme.Blackbeauty],
  defaultTheme: QuizTheme.WestermannBlue,
  darkModeCheckEnabled: false,
  enableTwitter: false,
  enableQuizPool: false,
  vapidPublicKey: 'BFy8kQxiV2p43Z8Xqs6isn7QRVDEvkqreDH3wH0QlDLDn8cZkbM41iOWwxUBsw_R0Y4Bv8AkI9sKj82P18q41z0',
};
