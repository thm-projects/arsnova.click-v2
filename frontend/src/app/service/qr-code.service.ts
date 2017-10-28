import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class QrCodeService {
  get qrCodeContent(): string {
    return this._qrCodeContent;
  }

  private _showQrCode: boolean;
  private subject: Subject<boolean>;
  private _qrCodeContent: string;

  constructor() {
    this.subject = new Subject();
    this.toggleQrCode('');
  }

  public toggleQrCode(hashtag: string) {
    this._qrCodeContent = `${document.location.origin}/quiz/${hashtag}`;
    this._showQrCode = !this._showQrCode;
    this.subject.next(!this._showQrCode);
  }

  public getSubscription(): Observable<boolean> {
    return this.subject.asObservable();
  }

}
