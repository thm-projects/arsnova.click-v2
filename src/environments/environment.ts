// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { LoginMechanism } from '../lib/enums/enums';
import { IEnvironment } from '../lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: false,
  ssrEndpoint: 'http://192.168.2.106:4000',
  serverEndpoint: 'http://192.168.2.106:3010',
  httpApiEndpoint: 'http://192.168.2.106:3010/api/v1',
  httpLibEndpoint: 'http://192.168.2.106:3010/lib',
  stompConfig: {
    endpoint: 'ws://127.0.0.1:15674/ws',
    user: 'guest',
    password: 'guest',
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
};

export enum DEVICE_TYPES {
  XS, SM, MD, LG, XLG
}

export enum LIVE_PREVIEW_ENVIRONMENT {
  ANSWEROPTIONS, QUESTION
}
