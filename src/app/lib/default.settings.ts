import { environment } from '../../environments/environment';

export const DefaultSettings = {
  siteId: 'arsnova.click-v2',
  ssrEndpoint: environment.ssrEndpoint,
  httpApiEndpoint: environment.httpApiEndpoint,
  httpLibEndpoint: environment.httpLibEndpoint,
  serverEndpoint: environment.serverEndpoint,
  defaultQuizSettings: {
    answers: {
      answerText: '',
      isCorrect: false, // Must be false so that surveys are valid (check if isCorrect is false)
      configCaseSensitive: false,
      configTrimWhitespaces: false,
      configUseKeywords: false,
      configUsePunctuation: false,
    },
    question: {
      dispayAnswerText: true,
      showOneAnswerPerRow: false,
      questionText: '',
      timer: 60,
      multipleSelectionEnabled: true,
      rangeMin: 0,
      rangeMax: 60,
      correctValue: 30,
      answerOptionList: [],
      tags: [],
    },
    sessionConfig: {
      music: {
        enabled: {
          lobby: true,
          countdownRunning: true,
          countdownEnd: true,
        },
        volumeConfig: {
          global: 60,
          lobby: 60,
          countdownRunning: 60,
          countdownEnd: 60,
          useGlobalVolume: true,
        },
        titleConfig: {
          lobby: 'Song0',
          countdownRunning: 'Song0',
          countdownEnd: 'Song0',
        },
      },
      nicks: {
        memberGroups: ['Default'],
        maxMembersPerGroup: 10,
        autoJoinToGroup: false,
        blockIllegalNicks: true,
        restrictToCasLogin: false,
        selectedNicks: [],
      },
      theme: environment.defaultTheme,
      readingConfirmationEnabled: true,
      showResponseProgress: true,
      confidenceSliderEnabled: true,
      cacheQuizAssets: false,
    },
  },
};