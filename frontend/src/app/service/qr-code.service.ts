import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ActiveQuestionGroupService} from './active-question-group.service';

@Injectable()
export class QrCodeService {
  get qrCodeContent(): string {
    return this._qrCodeContent;
  }
  get showQrCode(): boolean {
    return this._showQrCode;
  }

  private _showQrCode: boolean;
  private subject: Subject<boolean>;
  private _qrCodeContent: string;

  constructor(private activeQuestionGroupService: ActiveQuestionGroupService) {
    this.subject = new Subject();
    this.toggleQrCode();
    if (this.activeQuestionGroupService.activeQuestionGroup) {
      this._qrCodeContent = `${document.location.origin}/${this.activeQuestionGroupService.activeQuestionGroup.hashtag}`;
    }
  }

  public toggleQrCode() {
    this._showQrCode = !this._showQrCode;
    this.subject.next(!this._showQrCode);
  }

  public getSubscription(): Observable<boolean> {
    return this.subject.asObservable();
  }

}
