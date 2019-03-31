declare var require: any;

const environmentData = require(`../assets/serverEndpoint.json`);

export const DefaultSettings = {
  siteId: 'arsnova.click-v2',
  ssrEndpoint: environmentData.ssrEndpoint,
  httpApiEndpoint: environmentData.httpApiEndpoint,
  httpLibEndpoint: environmentData.httpLibEndpoint,
  serverEndpoint: environmentData.serverEndpoint,
  wsApiEndpoint: environmentData.wsApiEndpoint,
  defaultQuizSettings: {
    answers: {
      answerText: '',
      isCorrect: true,
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
      theme: 'theme-Material',
      readingConfirmationEnabled: true,
      showResponseProgress: true,
      confidenceSliderEnabled: true,
      cacheQuizAssets: false,
    },
  },
};
