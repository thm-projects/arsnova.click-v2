import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalI} from "../modals.module";
import {TranslateService} from "@ngx-translate/core";
import {ActiveQuestionGroupService} from "../../service/active-question-group.service";
import {questionGroupReflection} from "../../../lib/questions/questionGroup_reflection";
import {QuestionGroupI} from "../../../lib/questions/QuestionGroupI";

@Component({
  selector: 'app-available-quizzes',
  templateUrl: './available-quizzes.component.html',
  styleUrls: ['./available-quizzes.component.scss']
})
export class AvailableQuizzesComponent implements OnInit, ModalI {
  private _sessions: Array<QuestionGroupI> = [];

  dismiss(result?: any): void {
    this.activeModal.dismiss(result);
  }

  abort(result?: any): void {
    this.activeModal.close(result);
  }

  next(result?: any): void {
    this.activeModal.close(result);
  }

  get sessions(): Array<QuestionGroupI> {
    return this._sessions;
  }

  constructor(private translateService: TranslateService,
              private activeModal: NgbActiveModal,
              private activeQuestionGroupService: ActiveQuestionGroupService) {
    const sessions = JSON.parse(window.localStorage.getItem('owned_quizzes')) || [];
    sessions.sort(function (a, b) {
      return a > b;
    });
    const self = this;
    sessions.forEach(function (elem) {
      elem = JSON.parse(window.localStorage.getItem(elem));
      self._sessions.push(questionGroupReflection[elem.type](elem));
    });
  }

  startQuiz(session: QuestionGroupI): void {
    this.activeQuestionGroupService.activeQuestionGroup = session;
    this.next();
  }

  editQuiz(session: QuestionGroupI): void {
    this.activeQuestionGroupService.activeQuestionGroup = session;
    this.next();
  }

  ngOnInit() {
  }

}
