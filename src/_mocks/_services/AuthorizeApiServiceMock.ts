import { Observable, of } from 'rxjs';
import { MessageProtocol, StatusProtocol } from '../../app/lib/enums/Message';
import { IMessage } from '../../app/lib/interfaces/communication/IMessage';

export class AuthorizeApiServiceMock {
  public getAuthorizationForToken(token): Observable<IMessage> {
    return token === 'no-token' ? of({
      status: StatusProtocol.Failed,
      step: MessageProtocol.Authenticate,
      payload: {},
    }) : of({
      status: StatusProtocol.Success,
      step: MessageProtocol.Authenticate,
      payload: { casTicket: 'test-ticket' },
    });
  }

  public postAuthorizationForStaticLogin(data): Observable<IMessage> {
    return data.username ? of({
      status: StatusProtocol.Success,
      step: MessageProtocol.Authenticate,
      payload: { token: 'test-token' },
    }) : data.tokenHash ? of({
      status: StatusProtocol.Success,
      step: MessageProtocol.Authenticate,
      payload: {
        token: 'test-token',
        username: 'test-token-user',
      },
    }) : of({
      status: StatusProtocol.Failed,
      step: MessageProtocol.Authenticate,
      payload: {},
    });
  }
}
