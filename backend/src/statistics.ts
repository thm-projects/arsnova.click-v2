import {cpus, freemem, loadavg, totalmem, hostname, networkInterfaces} from 'os';
import {QuizManagerDAO} from './db/QuizManagerDAO';

const interfaces = networkInterfaces();
const localAddress = interfaces[Object.keys(interfaces).filter(netIface => {
  const singleInterface = interfaces[netIface][0];
  return singleInterface.family === 'IPv4' &&
         singleInterface.internal === false;
})[0]];
const localIpv4Address = localAddress ? localAddress[0].address : '127.0.0.1';
const portInternal = process.env.npm_package_config_portInternal || 3000;
const portExternal = process.env.npm_package_config_portExternal || portInternal;
const routePrefix = process.env.npm_package_config_routePrefix || '';
const rewriteAssetCacheUrl = process.env.npm_package_config_rewriteAssetCacheUrl || `https://${hostname()}:${portExternal}${routePrefix}`;

export const staticStatistics = {
  hostname: hostname(),
  port: portInternal,
  routePrefix: `${routePrefix}`,
  localIpv4Address: localIpv4Address,
  rewriteAssetCacheUrl: rewriteAssetCacheUrl,
  cpuCores: cpus().length,
};

export const dynamicStatistics = () => {
  return {
    uptime: process.uptime(),
    loadavg: loadavg(),
    freemem: freemem(),
    totalmem: totalmem(),
    connectedUsers: QuizManagerDAO.getAllActiveMembers(),
    activeQuizzes: QuizManagerDAO.getAllActiveQuizNames(),
    persistedQuizzes: Object.keys(QuizManagerDAO.getAllPersistedQuizzes()).length
  };
};
