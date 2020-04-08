export interface IServerStatistics {
  'appName': string;
  'appVersion': string;
  'hostname': string;
  'port': number;
  'routePrefix': string;
  'localIpv4Address': string;
  'rewriteAssetCacheUrl': string;
  'pathToAssets': string;
  'pathToMigrations': string;
  'pathToJobs': string;
  'cpuCores': number;
  'leaderboardAlgorithm': string;
  'twitter': {
    'searchKey': string;
  };
  'uptime': number;
  'loadavg': Array<number>;
  'freemem': number;
  'totalmem': number;
  'quiz': {
    'total': number,
    'active': number,
    'pool': {
      'questions': number,
      'tags': number
    },
    'participants': {
      'active': number,
      'average': number
    }
  };
  'activeSockets': number;
}
