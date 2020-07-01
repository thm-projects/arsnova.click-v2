import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { environment } from '../environments/environment';
import { DefaultSettings } from './lib/default.settings';

const rxStompConfig: InjectableRxStompConfig = {
  brokerURL: DefaultSettings.stompEndpoint,

  connectHeaders: {
    login: environment.stompConfig.user,
    passcode: environment.stompConfig.password,
    host: environment.stompConfig.vhost,
  },

  heartbeatIncoming: 0,
  heartbeatOutgoing: 20000,

  reconnectDelay: 500,
};

if (!environment.production) {
  rxStompConfig.debug = (msg: string): void => {
    console.log(new Date(), msg);
  };
}

export default rxStompConfig;
