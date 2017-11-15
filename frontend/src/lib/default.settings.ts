const isLiveEnvironment = !location.hostname.match(/localhost/g);
const serverEndpoints = {
  live: {
    httpApiEndpoint: `https://${location.hostname}/backend/api/v1`,
    httpLibEndpoint: `https://${location.hostname}/backend/lib`,
    wsApiEndpoint: `wss://${location.hostname}/backend`,
  },
  local: {
    httpApiEndpoint: `http://${location.hostname}:3000/api/v1`,
    httpLibEndpoint: `http://${location.hostname}:3000/lib`,
    wsApiEndpoint: `ws://${location.hostname}:3000`,
  }
};
const serverEndpoint = isLiveEnvironment ? serverEndpoints.live : serverEndpoints.local;

export const DefaultSettings = {
  siteId: 'arsnova.click-v2',
  httpApiEndpoint: serverEndpoint.httpApiEndpoint,
  httpLibEndpoint: serverEndpoint.httpLibEndpoint,
  wsApiEndpoint: serverEndpoint.wsApiEndpoint,
  defaultSettings: {
    answers: {
      displayAnswerTextOnButtons: true,
      answerText: '',
      isCorrect: true,
      configCaseSensitive: false,
      configTrimWhitespaces: false,
      configUseKeywords: false,
      configUsePunctuation: false
    },
    question: {
      showOneAnswerPerRow: true,
      text: '',
      timer: 0,
      multipleSurveySelectionEnabled: true,
      rangeMin: 0,
      rangeMax: 60,
      correctValue: 30
    },
    music: {
      enabled: {
        lobby: true,
        countdownRunning: true,
        countdownEnd: true
      },
      volume: {
        global: 60,
        lobby: 60,
        countdownRunning: 60,
        countdownEnd: 60,
        useGlobal: true
      },
      title: {
        lobby: 'Song0',
        countdownRunning: 'Song0',
        countdownEnd: 'Song0'
      },
      availableTitles: {
        basePath: 'public/songs',
        lobby: ['Song0', 'Song1', 'Song2', 'Song3'],
        countdownRunning: ['Song0', 'Song1', 'Song2'],
        countdownEnd: ['Song0', 'Song1']
      }
    },
    nicks: {
      blockIllegalNicks: true,
      restrictToCasLogin: false
    },
    theme: 'theme-Material',
    readingConfirmationEnabled: true,
    showResponseProgress: true,
    confidenceSliderEnabled: true,
    cacheQuizAssets: false
  }
};
