import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Attendee } from '../../lib/attendee/attendee';
import { MemberEntity } from '../../lib/entities/member/MemberEntity';
import { StorageKey } from '../../lib/enums/enums';
import { QuizState } from '../../lib/enums/QuizState';
import { IMemberSerialized } from '../../lib/interfaces/entities/Member/IMemberSerialized';
import { MemberApiService } from '../api/member/member-api.service';
import { QuizService } from '../quiz/quiz.service';
import { StorageService } from '../storage/storage.service';
import { BonusTokenService } from '../user/bonus-token/bonus-token.service';

@Injectable({ providedIn: 'root' })
export class AttendeeService {
  public readonly attendeeAmount = new ReplaySubject<number>(1);

  private _attendees: Array<MemberEntity> = [];

  get attendees(): Array<MemberEntity> {
    return this._attendees;
  }

  set attendees(value: Array<MemberEntity>) {
    this._attendees = value;
  }

  private _ownNick: string;

  get ownNick(): string {
    return this._ownNick;
  }

  set ownNick(value: string) {
    this._ownNick = value;
    sessionStorage.setItem(StorageKey.CurrentNickName, value);
  }

  private _bonusToken: string;

  get bonusToken(): string {
    return this._bonusToken;
  }

  set bonusToken(value: string) {
    this._bonusToken = value;
    sessionStorage.setItem(StorageKey.CurrentBonusToken, value);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private quizService: QuizService,
    private storageService: StorageService,
    private memberApiService: MemberApiService,
    private bonusTokenService: BonusTokenService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  public getMemberGroups(): Array<string> {

    if (!this.quizService.quiz) {
      return [];
    }

    return this.quizService.quiz.sessionConfig.nicks.memberGroups;
  }

  public getMembersOfGroup(groupName: string): Array<MemberEntity> {
    return this._attendees.filter(attendee => attendee.groupName === groupName);
  }

  public cleanUp(): void {
    this.attendees = [];
    this.ownNick = null;
  }

  public addMember(attendee: IMemberSerialized): void {
    console.log('AttendeeService: Adding member', attendee);
    if (!this.getMember(attendee.name)) {
      this._attendees.push(new Attendee(attendee));
    }
  }

  public removeMember(name: string): void {
    const member = this.getMember(name);
    if (member) {
      this._attendees.splice(this._attendees.indexOf(member), 1);
    }
  }

  public clearResponses(): void {
    this._attendees.forEach((attendee) => {
      attendee.responses.forEach(response => {
        response.confidence = -1;
        response.readingConfirmation = false;
        response.responseTime = -1;
        response.value = [];
      });
    });
  }

  public isOwnNick(name: string): boolean {
    return name === this._ownNick;
  }

  public modifyResponse(payload: { nickname: string, questionIndex: number, update: { [key: string]: any } }): void {
    const member = this.getMember(payload.nickname);
    if (!member) {
      console.error('AttendeeService: Cannot add member response. Member not found', payload.nickname);
      return;
    }

    Object.keys(payload.update).forEach(updateKey => {
      member.responses[payload.questionIndex][updateKey] = payload.update[updateKey];
    });
  }

  public hasReponse(): boolean {
    if (!this.getMember(this.ownNick)) {
      return;
    }

    const response = this.getMember(this.ownNick).responses[this.quizService.quiz.currentQuestionIndex];
    if (typeof response?.value === 'undefined') {
      return false;
    }

    if (typeof response.value === 'number') {
      return !isNaN(response.value);
    }

    return response.value.length > 0;
  }

  public hasReadingConfirmation(): boolean {
    if (!this.getMember(this.ownNick)) {
      return;
    }

    const response = this.getMember(this.ownNick).responses[this.quizService.quiz.currentQuestionIndex];
    return response?.readingConfirmation;
  }

  public hasConfidenceValue(): boolean {
    if (!this.getMember(this.ownNick)) {
      return;
    }

    const response = this.getMember(this.ownNick).responses[this.quizService.quiz.currentQuestionIndex];
    return response && !isNaN(response.confidence) && response.confidence > -1;
  }

  public getActiveMembers(): Array<MemberEntity> {
    return this.attendees.filter((member) => member.isActive);
  }

  public reloadData(): void {
    this.restoreMembers();
  }

  private restoreMembers(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.memberApiService.getMembers(this.quizService.quiz.name).subscribe((data) => {
        if (!data || !data.payload) {
          return;
        }

        this._attendees = data.payload.members.map((attendee) => {
          return new Attendee(attendee);
        });

        this.attendeeAmount.next(this._attendees.length);

        if (!this.quizService.isOwner) {
          this.bonusTokenService.getBonusToken().subscribe(nextResult => {
            this.bonusToken = nextResult;
          }, err => console.error('Observer got an error: ' + err));
        }
        resolve();
      }, () => reject());
    });
  }

  private loadData(): void {
    this._ownNick = sessionStorage.getItem(StorageKey.CurrentNickName);
    this.quizService.quizUpdateEmitter.subscribe(quiz => {
      if (typeof quiz?.state === 'undefined' || quiz.state === QuizState.Inactive) {
        return;
      }

      console.log('AttendeeService#loadData', 'quiz set', quiz);
      this.restoreMembers();
    });
  }

  private getMember(nickname: string): MemberEntity {
    return this._attendees.find(value => value.name === nickname);
  }

}
