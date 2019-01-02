import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Attendee } from '../../../lib/attendee/attendee';
import { MemberEntity } from '../../../lib/entities/member/MemberEntity';
import { MemberGroupEntity } from '../../../lib/entities/member/MemberGroupEntity';
import { IMemberSerialized } from '../../../lib/interfaces/entities/Member/IMemberSerialized';
import { MemberApiService } from '../api/member/member-api.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { QuizService } from '../quiz/quiz.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AttendeeService {
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
    sessionStorage.setItem('nick', value);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private footerBarService: FooterBarService,
    private quizService: QuizService,
    private storageService: StorageService,
    private memberApiService: MemberApiService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }
  }

  public getMemberGroups(): Array<MemberGroupEntity> {

    if (!this.quizService.quiz) {
      if (!this.quizService.quiz) {
        return [];
      }

      return this.quizService.quiz.memberGroups;
    }

    return this.quizService.quiz.memberGroups;
  }

  public getMembersOfGroup(groupName: string): Array<IMemberSerialized> {
    return this._attendees.filter(attendee => attendee.groupName === groupName);
  }

  public cleanUp(): void {
    if (this.quizService.quiz && this.ownNick) {
      this.memberApiService.deleteMember(this.quizService.quiz.name, this.ownNick).subscribe();
    }
    this.attendees = [];
    this.ownNick = null;
  }

  public addMember(attendee: IMemberSerialized): void {
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
      attendee.responses.splice(0, attendee.responses.length);
    });
  }

  public isOwnNick(name: string): boolean {
    return name === this._ownNick;
  }

  public modifyResponse(payload: { nickname: string, update: { [key: string]: any } }): void {
    const member = this.getMember(payload.nickname);
    if (!member) {
      console.error('Cannot add member response. Member not found', payload.nickname);
      return;
    }

    Object.keys(payload.update).forEach(updateKey => {
      member.responses[this.quizService.quiz.currentQuestionIndex][updateKey] = payload.update[updateKey];
    });
  }

  public getOwnNick(): MemberEntity {
    return this.getMember(this.ownNick);
  }

  public getMemberByName(name: string): MemberEntity {
    return this._attendees.find(member => member.name === name);
  }

  public restoreMembers(): void {
    this.memberApiService.getMembers().subscribe((data: Array<MemberEntity>) => {
      this._attendees = data.map((attendee) => {
        return new Attendee(attendee);
      });
      if (this._attendees.length) {
        this.footerBarService.footerElemStartQuiz.isActive = true;
      }
    });
  }

  private loadData(): void {
    this._ownNick = sessionStorage.getItem('nick');
  }

  private getMember(nickname: string): MemberEntity {
    return this._attendees.find(value => value.name === nickname);
  }
}
