export interface IServerStatistics {
  'leaderboardAlgorithm': string;
  'quiz': {
    'total': number,
    'active': number,
    'pool': {
      'questions': number,
      'pendingQuestionAmount'?: number,
      'tags': number
    },
    'participants': {
      'active': number,
      'average': number
    }
  };
  'activeSockets': number;
}
