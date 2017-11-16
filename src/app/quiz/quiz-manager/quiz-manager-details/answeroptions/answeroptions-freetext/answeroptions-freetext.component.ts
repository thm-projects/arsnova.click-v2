import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActiveQuestionGroupService} from '../../../../../service/active-question-group.service';
import {ActivatedRoute} from '@angular/router';
import {FreeTextAnswerOption} from 'arsnova-click-v2-types/src/answeroptions/answeroption_freetext';
import {IQuestion} from 'arsnova-click-v2-types/src/questions/interfaces';
import {IFreetextAnswerOption} from 'arsnova-click-v2-types/src/answeroptions/interfaces';

@Component({
  selector: 'app-answeroptions-freetext',
  templateUrl: './answeroptions-freetext.component.html',
  styleUrls: ['./answeroptions-freetext.component.scss']
})
export class AnsweroptionsFreetextComponent implements OnInit, OnDestroy {
  private _questionIndex: number;
  private _routerSubscription: Subscription;
  private _testInput = '';
  private _question: IQuestion;
  private _matchText = '';
  private _answer: IFreetextAnswerOption;

  get question(): IQuestion {
    return this._question;
  }
  get matchText(): string {
    return this._matchText;
  }
  get answer(): IFreetextAnswerOption {
    return this._answer;
  }

  constructor(
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute
  ) {
  }


  setTestInput(event: Event): void {
    this._testInput = (<HTMLTextAreaElement>event.target).value;
  }

  setMatchText(event: Event): void {
    this._question.answerOptionList[0].answerText = (<HTMLTextAreaElement>event.target).value;
  }

  hasTestInput(): boolean {
    return this._testInput.length > 0;
  }

  testInputCorrect(): boolean {
    return (<FreeTextAnswerOption>this._question.answerOptionList[0]).isCorrectInput(this._testInput);
  }

  setConfig(configIdentifier: string, configValue: boolean): void {
    (<FreeTextAnswerOption>this._question.answerOptionList[0]).setConfig(configIdentifier, configValue);
  }

  ngOnInit() {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this._matchText = this._question.answerOptionList[0].answerText;
      this._answer = <IFreetextAnswerOption>this._question.answerOptionList[0];
    });
  }

  @HostListener('window:beforeunload', [ '$event' ])
  ngOnDestroy() {
    this.activeQuestionGroupService.persist();
    this._routerSubscription.unsubscribe();
  }
}
