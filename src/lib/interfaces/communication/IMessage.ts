import { MessageProtocol, StatusProtocol } from '../../enums/Message';

export interface IMessage {
  status?: StatusProtocol;
  step: MessageProtocol;
  payload?: any;
}
