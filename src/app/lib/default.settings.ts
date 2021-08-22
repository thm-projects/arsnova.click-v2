import { environment } from '../../environments/environment';

function stompEndpointFactory(): string {
  if (typeof location === 'undefined') {
    return null;
  }

  if (environment.stompConfig.endpoint.startsWith('/')) {
    return location.protocol.replace('http', 'ws') + location.host + environment.stompConfig.endpoint;
  }

  return environment.stompConfig.endpoint;
}

export const DefaultSettings = {
  siteId: 'arsnova.click-v2',
  httpApiEndpoint: environment.serverEndpoint + '/api/v1',
  httpLibEndpoint: environment.serverEndpoint + '/api/lib',
  stompEndpoint: stompEndpointFactory(),
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
      showOneAnswerPerRow: true,
      questionText: '',
      timer: 30,
      multipleSelectionEnabled: true,
      rangeMin: 0,
      rangeMax: 60,
      correctValue: 30,
      answerOptionList: [],
      tags: [],
      requiredForToken: true,
      difficulty: 5
    },
    sessionConfig: {
      music: {
        enabled: {
          lobby: true,
          countdownRunning: true,
          countdownEnd: true,
        },
        shared: {
          lobby: false,
          countdownRunning: false,
          countdownEnd: false,
        },
        volumeConfig: {
          global: 60,
          lobby: 60,
          countdownRunning: 60,
          countdownEnd: 60,
          useGlobalVolume: true,
        },
        titleConfig: {
          lobby: 'Song3',
          countdownRunning: 'Song1',
          countdownEnd: 'Song1',
        },
      },
      nicks: {
        memberGroups: [],
        maxMembersPerGroup: 10,
        autoJoinToGroup: false,
        blockIllegalNicks: true,
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
