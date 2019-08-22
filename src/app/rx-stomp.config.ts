import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { environment } from '../environments/environment';

const rxStompConfig: InjectableRxStompConfig = {
  brokerURL: environment.stompEndpoint,

  connectHeaders: {
    login: 'guest',
    passcode: 'guest',
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
