import {Injectable} from '@angular/core';
import {questionGroupReflection} from '../../lib/questions/questionGroup_reflection';
import {IQuestionGroup} from '../../lib/questions/interfaces';

@Injectable()
export class ActiveQuestionGroupService {
  get activeQuestionGroup(): IQuestionGroup {
    return this._activeQuestionGroup;
  }

  set activeQuestionGroup(value: IQuestionGroup) {
    if (!value) {
      window.sessionStorage.removeItem('questionGroup');
    } else {
      window.sessionStorage.setItem('questionGroup', JSON.stringify(value.serialize()));
    }
    this._activeQuestionGroup = value;
  }

  private _activeQuestionGroup: IQuestionGroup;

  constructor() {
    if (window.sessionStorage.getItem('questionGroup')) {
      const serializedObject = window.sessionStorage.getItem('questionGroup');
      const parsedObject = JSON.parse(serializedObject);
      this.activeQuestionGroup = questionGroupReflection[parsedObject.type](parsedObject);
    }
  }

  persist() {
    window.localStorage.setItem(this.activeQuestionGroup.hashtag, JSON.stringify(this.activeQuestionGroup.serialize()));
    window.sessionStorage.setItem('questionGroup', JSON.stringify(this.activeQuestionGroup.serialize()));
    const questionList = JSON.parse(window.localStorage.getItem('owned_quizzes')) || [];
    if (questionList.indexOf(this.activeQuestionGroup.hashtag) === -1) {
      questionList.push(this.activeQuestionGroup.hashtag);
      window.localStorage.setItem('owned_quizzes', JSON.stringify(questionList));
    }
  }
}
