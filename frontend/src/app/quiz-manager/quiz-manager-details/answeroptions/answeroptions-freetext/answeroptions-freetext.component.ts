import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {FreeTextAnswerOption} from '../../../../../lib/answeroptions/answeroption_freetext';
import {IQuestion} from '../../../../../lib/questions/interfaces';

@Component({
             selector: 'app-answeroptions-freetext',
             templateUrl: './answeroptions-freetext.component.html',
             styleUrls: ['./answeroptions-freetext.component.scss']
           })
export class AnsweroptionsFreetextComponent implements OnInit, OnDestroy {
  get matchText(): string {
    return this._matchText;
  }

  get question(): IQuestion {
    return this._question;
  }

  private _questionIndex: number;
  private _question: IQuestion;
  private _routerSubscription: Subscription;
  private _testInput = '';
  private _matchText = '';

  constructor(
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private translateService: TranslateService,
    private route: ActivatedRoute) {
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
    });
  }

  ngOnDestroy() {
    this.activeQuestionGroupService.persist();
    this._routerSubscription.unsubscribe();
  }
}
