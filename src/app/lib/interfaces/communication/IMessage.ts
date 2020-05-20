import { MessageProtocol, StatusProtocol } from '../../enums/Message';

export interface IMessage<T = any> {
  status?: StatusProtocol;
  step: MessageProtocol;
  payload?: T;
}
