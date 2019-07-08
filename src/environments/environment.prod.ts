import { LoginMechanism } from '../lib/enums/enums';
import { IEnvironment } from '../lib/interfaces/IEnvironment';

export const environment: IEnvironment = {
  production: true,
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
