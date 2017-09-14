import { Component, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalI} from "../modals.module";
import {TranslateService} from "@ngx-translate/core";
import {ActiveQuestionGroupService} from "../../service/active-question-group.service";
import {DefaultQuestionGroup} from "../../../lib/questions/questiongroup_default";
import {AbstractQuestion} from "../../../lib/questions/question_abstract";
import {AbstractQuestionGroup} from "../../../lib/questions/questiongroup_abstract";

@Component({
  selector: 'app-available-quizzes',
  templateUrl: './available-quizzes.component.html',
  styleUrls: ['./available-quizzes.component.scss']
})
export class AvailableQuizzesComponent implements OnInit, ModalI {
  private _sessions: Array<AbstractQuestionGroup> = [];

  dismiss(result?: any): void {
    this.activeModal.dismiss(result);
  }

  abort(result?: any): void {
    this.activeModal.close(result);
  }

  next(result?: any): void {
    this.activeModal.close(result);
  }

  get sessions(): Array<AbstractQuestionGroup> {
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
      self._sessions.push(new DefaultQuestionGroup(JSON.parse(window.localStorage.getItem(elem))));
    });
  }

  startQuiz(session: AbstractQuestionGroup): void {
    this.activeQuestionGroupService.activeQuestionGroup = session;
    this.next();
  }

  editQuiz(session: AbstractQuestionGroup): void {
    this.activeQuestionGroupService.activeQuestionGroup = session;
    this.next();
  }

  ngOnInit() {
  }

}
