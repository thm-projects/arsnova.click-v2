import { LoginMechanism, Title } from '../app/lib/enums/enums';
import { QuizTheme } from '../app/lib/enums/QuizTheme';
import { IEnvironment } from '../app/lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: true,
  title: Title.Default,
  appName: 'Westermann Quiz',
  version: '__VERSION__',
  sentryDSN: 'https://14415a5e358f4c04b6a878072d352c4e@sentry.arsnova.click/2',
  serverEndpoint: 'http://localhost:3010',
  stompConfig: {
    endpoint: 'ws://localhost:15674/ws',
    user: 'arsnova-click',
    password: 'K3BHZQMHsxh6XQ5a',
    vhost: '/',
  },
  leaderboardAmount: 5,
  enableBonusToken: true,
  readingConfirmationEnabled: true,
  confidenceSliderEnabled: true,
  infoAboutTabEnabled: true,
  infoProjectTabEnabled: true,
  infoBackendApiEnabled: true,
  requireLoginToCreateQuiz: false,
  forceQuizTheme: false,
  loginMechanism: [LoginMechanism.UsernamePassword],
  showLoginButton: true,
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
  showInfoButtonsInFooter: false,
  vapidPublicKey: 'BFy8kQxiV2p43Z8Xqs6isn7QRVDEvkqreDH3wH0QlDLDn8cZkbM41iOWwxUBsw_R0Y4Bv8AkI9sKj82P18q41z0',
  markdownFilePostfix: 'westermann',
  loginButtonLabelConfiguration: 'administration',
};
