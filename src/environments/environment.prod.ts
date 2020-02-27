import { LoginMechanism, Title } from '../app/lib/enums/enums';
import { QuizTheme } from '../app/lib/enums/QuizTheme';
import { IEnvironment } from '../app/lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: true,
  title: Title.Default,
  version: 'VERSION',
  enableCasLogin: true,
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
  leaderboardAmount: 5,
  readingConfirmationEnabled: false,
  confidenceSliderEnabled: false,
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
};

export enum DEVICE_TYPES {
  XS, SM, MD, LG, XLG
}

export enum LIVE_PREVIEW_ENVIRONMENT {
  ANSWEROPTIONS, QUESTION
}
