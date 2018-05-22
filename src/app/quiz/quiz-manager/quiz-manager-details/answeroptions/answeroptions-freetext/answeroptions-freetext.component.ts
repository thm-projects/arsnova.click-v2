import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FreeTextAnswerOption } from 'arsnova-click-v2-types/src/answeroptions/answeroption_freetext';
import { IFreetextAnswerOption } from 'arsnova-click-v2-types/src/answeroptions/interfaces';
import { IQuestion } from 'arsnova-click-v2-types/src/questions/interfaces';
import { Subscription } from 'rxjs';
import { ActiveQuestionGroupService } from '../../../../../service/active-question-group/active-question-group.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';

@Component({
  selector: 'app-answeroptions-freetext',
  templateUrl: './answeroptions-freetext.component.html',
  styleUrls: ['./answeroptions-freetext.component.scss'],
})
export class AnsweroptionsFreetextComponent implements OnInit, OnDestroy {
  public static TYPE = 'AnsweroptionsFreetextComponent';

  private _question: IQuestion;

  get question(): IQuestion {
    return this._question;
  }

  private _matchText = '';

  get matchText(): string {
    return this._matchText;
  }

  private _answer: Array<IFreetextAnswerOption>;

  get answer(): Array<IFreetextAnswerOption> {
    return this._answer;
  }

  private _testInput = '';

  get testInput(): string {
    return this._testInput;
  }

  private _questionIndex: number;
  private _routerSubscription: Subscription;

  constructor(
    private headerLabelService: HeaderLabelService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private route: ActivatedRoute,
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';
  }


  public setTestInput(event: Event): void {
    this._testInput = (<HTMLTextAreaElement>event.target).value;
  }

  public setMatchText(event: Event): void {
    this._question.answerOptionList[0].answerText = (<HTMLTextAreaElement>event.target).value;
  }

  public hasTestInput(): boolean {
    return this._testInput.length > 0;
  }

  public isTestInputCorrect(): boolean {
    return (<FreeTextAnswerOption>this._question.answerOptionList[0]).isCorrectInput(this._testInput);
  }

  public setConfig(configIdentifier: string, configValue: boolean): void {
    (<FreeTextAnswerOption>this._question.answerOptionList[0]).setConfig(configIdentifier, configValue);
  }

  public ngOnInit(): void {
    this._routerSubscription = this.route.params.subscribe(params => {
      this._questionIndex = +params['questionIndex'];
      this._question = this.activeQuestionGroupService.activeQuestionGroup.questionList[this._questionIndex];
      this._matchText = this._question.answerOptionList[0].answerText;
      this._answer = <Array<IFreetextAnswerOption>>this._question.answerOptionList;
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  public ngOnDestroy(): void {
    this.activeQuestionGroupService.persist();
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }
}
