import { LoginMechanism } from '../lib/enums/enums';
import { IEnvironment } from '../lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: true,
  ssrEndpoint: 'https://staging.arsnova.click/backend',
  serverEndpoint: 'https://staging.arsnova.click/backend',
  httpApiEndpoint: 'https://staging.arsnova.click/backend/api/v1',
  httpLibEndpoint: 'https://staging.arsnova.click/backend/lib',
  stompConfig: {
    endpoint: 'wss://staging.arsnova.click/rabbitmq/ws',
    user: 'guest',
    password: 'guest',
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
};

export enum DEVICE_TYPES {
  XS, SM, MD, LG, XLG
}

export enum LIVE_PREVIEW_ENVIRONMENT {
  ANSWEROPTIONS, QUESTION
}
