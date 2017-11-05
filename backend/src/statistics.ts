import {cpus, freemem, loadavg, totalmem, hostname, networkInterfaces} from 'os';
import QuizManager from './db/quiz-manager';

const interfaces = networkInterfaces();
const localAddress = interfaces[Object.keys(interfaces).filter(netIface => {
  const singleInterface = interfaces[netIface][0];
  return singleInterface.family === 'IPv4' &&
         singleInterface.internal === false;
})[0]];
const localIpv4Address = localAddress ? localAddress[0].address : '127.0.0.1';

export const staticStatistics = {
  hostname: hostname(),
  port: 3000,
  localIpv4Address: localIpv4Address,
  cpuCores: cpus().length,
};

export const dynamicStatistics = () => {
  return {
    uptime: process.uptime(),
    loadavg: loadavg(),
    freemem: freemem(),
    totalmem: totalmem(),
    connectedUsers: QuizManager.getAllActiveMembers(),
    activeQuizzes: QuizManager.getAllActiveQuizNames(),
    persistedQuizzes: Object.keys(QuizManager.getAllPersistedQuizzes()).length
  };
};
