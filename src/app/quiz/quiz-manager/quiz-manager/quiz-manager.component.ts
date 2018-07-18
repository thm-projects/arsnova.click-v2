import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DefaultAnswerOption } from 'arsnova-click-v2-types/src/answeroptions/answeroption_default';
import { IQuestion, IQuestionGroup } from 'arsnova-click-v2-types/src/questions/interfaces';
import { questionReflection } from 'arsnova-click-v2-types/src/questions/question_reflection';
import { availableQuestionTypes, IAvailableQuestionType } from '../../../../lib/available-question-types';
import { DefaultSettings } from '../../../../lib/default.settings';
import { FooterbarElement } from '../../../../lib/footerbar-element/footerbar-element';
import { ActiveQuestionGroupService } from '../../../service/active-question-group/active-question-group.service';
import { LobbyApiService } from '../../../service/api/lobby/lobby-api.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { TrackingService } from '../../../service/tracking/tracking.service';

@Component({
  selector: 'app-quiz-manager',
  templateUrl: './quiz-manager.component.html',
  styleUrls: ['./quiz-manager.component.scss'],
})
export class QuizManagerComponent implements OnDestroy {
  public static TYPE = 'QuizManagerComponent';

  public questionGroupItem: IQuestionGroup;

  private _selectableQuestionTypes = availableQuestionTypes;

  get selectableQuestionTypes(): Array<IAvailableQuestionType> {
    return this._selectableQuestionTypes;
  }

  constructor(
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private router: Router,
    private currentQuizService: CurrentQuizService,
    private translateService: TranslateService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private trackingService: TrackingService,
    private lobbyApiService: LobbyApiService,
  ) {
    headerLabelService.headerLabel = 'component.quiz_manager.title';

    this.footerBarService.TYPE_REFERENCE = QuizManagerComponent.TYPE;

    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemStartQuiz,
      this.footerBarService.footerElemProductTour,
      this.footerBarService.footerElemNicknames,
      this.footerBarService.footerElemMemberGroup,
      this.footerBarService.footerElemSound,
    ]);
    this.activeQuestionGroupService.loadData();

    this.questionGroupItem = activeQuestionGroupService.activeQuestionGroup;
    this.footerBarService.footerElemStartQuiz.isActive = activeQuestionGroupService.activeQuestionGroup.isValid();

    this.footerBarService.footerElemStartQuiz.onClickCallback = async (self: FooterbarElement) => {
      if (!self.isActive) {
        return;
      }
      this.currentQuizService.quiz = this.questionGroupItem;
      await this.currentQuizService.cacheQuiz();
      await this.lobbyApiService.putLobby({
        quiz: this.currentQuizService.quiz.serialize(),
      }).toPromise();
      this.router.navigate(['/quiz', 'flow', 'lobby']);
    };
  }

  public ngOnDestroy(): void {
    this.footerBarService.footerElemStartQuiz.restoreClickCallback();
  }

  public addQuestion(id: string): void {
    if (!questionReflection[id]) {
      return;
    }

    const question: IQuestion = questionReflection[id](DefaultSettings.defaultQuizSettings.question);

    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `add-question`,
    });
    switch (id) {
      case 'TrueFalseSingleChoiceQuestion':
        question.answerOptionList = [
          new DefaultAnswerOption({
            answerText: this.translateService.instant('global.true'),
            isCorrect: false,
          }), new DefaultAnswerOption({
            answerText: this.translateService.instant('global.false'),
            isCorrect: false,
          }),
        ];
        break;
      case 'YesNoSingleChoiceQuestion':
        question.answerOptionList = [
          new DefaultAnswerOption({
            answerText: this.translateService.instant('global.yes'),
            isCorrect: false,
          }), new DefaultAnswerOption({
            answerText: this.translateService.instant('global.no'),
            isCorrect: false,
          }),
        ];
    }
    this.activeQuestionGroupService.activeQuestionGroup.addQuestion(question);
    this.footerBarService.footerElemStartQuiz.isActive = this.activeQuestionGroupService.activeQuestionGroup.isValid();
    this.activeQuestionGroupService.persist();
  }

  public moveQuestionUp(id: number): void {
    if (!id) {
      return;
    }

    const question = this.activeQuestionGroupService.activeQuestionGroup.questionList[id];
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `move-question-up`,
    });
    this.activeQuestionGroupService.activeQuestionGroup.removeQuestion(id);
    this.activeQuestionGroupService.activeQuestionGroup.addQuestion(question, id - 1);
    this.activeQuestionGroupService.persist();
  }

  public moveQuestionDown(id: number): void {
    if (id === this.activeQuestionGroupService.activeQuestionGroup.questionList.length - 1) {
      return;
    }

    const question = this.activeQuestionGroupService.activeQuestionGroup.questionList[id];
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `move-question-down`,
    });
    this.activeQuestionGroupService.activeQuestionGroup.removeQuestion(id);
    this.activeQuestionGroupService.activeQuestionGroup.addQuestion(question, id + 1);
    this.activeQuestionGroupService.persist();
  }

  public deleteQuestion(id: number): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `delete-question`,
    });
    this.activeQuestionGroupService.activeQuestionGroup.removeQuestion(id);
    this.footerBarService.footerElemStartQuiz.isActive = this.activeQuestionGroupService.activeQuestionGroup.isValid();
    this.activeQuestionGroupService.persist();
  }

  public trackEditQuestion(): void {
    this.trackingService.trackClickEvent({
      action: QuizManagerComponent.TYPE,
      label: `edit-question`,
    });
  }
}
