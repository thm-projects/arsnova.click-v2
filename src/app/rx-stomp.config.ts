import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import { environment } from '../environments/environment';

const rxStompConfig: InjectableRxStompConfig = {
  brokerURL: environment.stompConfig.endpoint,

  connectHeaders: {
    login: environment.stompConfig.user,
    passcode: environment.stompConfig.password,
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
