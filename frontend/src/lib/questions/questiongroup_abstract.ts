/*
 * This file is part of ARSnova Click.
 * Copyright (C) 2016 The ARSnova Team
 *
 * ARSnova Click is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Click is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Click.  If not, see <http://www.gnu.org/licenses/>.*/

import {questionReflection} from './question_reflection';
import {IQuestionGroup} from './interfaces';
import {ISessionConfiguration} from '../session_configuration/interfaces';
import {IQuestion} from './interfaces';

export abstract class AbstractQuestionGroup implements IQuestionGroup {
  get hashtag(): string {
    return this._hashtag;
  }

  set hashtag(value: string) {
    this._hashtag = value;
  }

  get isFirstStart(): boolean {
    return this._isFirstStart;
  }

  set isFirstStart(value: boolean) {
    this._isFirstStart = value;
  }

  get questionList(): Array<IQuestion> {
    return this._questionList;
  }

  set questionList(value: Array<IQuestion>) {
    this._questionList = value;
  }

  get sessionConfig(): ISessionConfiguration {
    return this._sessionConfig;
  }

  set sessionConfig(value: ISessionConfiguration) {
    this._sessionConfig = value;
  }

  private _hashtag: string;
  private _isFirstStart: boolean;
  private _questionList: Array<IQuestion>;
  private _sessionConfig: ISessionConfiguration;

  constructor({hashtag, questionList, isFirstStart = true, sessionConfig}) {
    this._questionList = questionList;
    this._hashtag = hashtag;
    this._isFirstStart = isFirstStart;
    this._sessionConfig = sessionConfig;
  }

  /**
   * Adds a question to the questionGroup instance
   * @param {SingleChoiceQuestion|MultipleChoiceQuestion|RangedQuestion|SurveyQuestion} question The question which extends {QuestionI} to be added
   * @param {Number} [index] An optional index position where the item should be added
   * @returns {IQuestion|Null} if successful returns the inserted Question otherwise Null
   */
  addQuestion(question: IQuestion, index: number = -1): IQuestion | void {
    if (index === -1 || index >= this.questionList.length) {
      this.questionList.push(question);
    } else {
      this.questionList.splice(index, 0, question);
    }
    return question;
  }

  /**
   * Removes a question by the specified index
   * @param {Number} index The index of the question to be removed
   * @throws {Error} If the index is not passed, smaller than 0 or larger than the length of the questionList
   */
  removeQuestion(index: number): void {
    if (index < 0 || index > this.questionList.length) {
      throw new Error('Invalid argument list for QuestionGroup.removeQuestion');
    }
    this._questionList.splice(index, 1);
  }

  /**
   * Serialize the instance object to a JSON compatible object
   * @returns {{hashtag: String, type: String, questionList: Array}}
   */
  serialize(): any {
    const questionListSerialized = [];
    this.questionList.forEach(function (question: IQuestion) {
      questionListSerialized.push(question.serialize());
    });
    return {
      hashtag: this.hashtag,
      isFirstStart: this.isFirstStart,
      questionList: questionListSerialized,
      sessionConfig: this.sessionConfig.serialize()
    };
  }

  /**
   * Checks if the properties of this instance are valid. Checks also recursively all including Question instances
   * and summarizes their result of calling .isValid()
   * @returns {boolean} True, if the complete QuestionGroup instance is valid, False otherwise
   */
  isValid(): boolean {
    let questionListValid = this.questionList.length > 0;
    this.questionList.forEach(function (question) {
      if (questionListValid && !question.isValid()) {
        questionListValid = false;
      }
    });
    return questionListValid;
  }

  /**
   * Checks for equivalence relations to another questionGroup instance. Also part of the EJSON interface
   * @see http://docs.meteor.com/api/ejson.html#EJSON-CustomType-equals
   * @param {AbstractQuestionGroup} questionGroup The questionGroup instance which should be checked
   * @returns {boolean} True if both instances are completely equal, False otherwise
   */
  equals(questionGroup: IQuestionGroup): boolean {
    if (questionGroup instanceof AbstractQuestionGroup) {
      if (questionGroup.hashtag !== this.hashtag ||
        questionGroup.isFirstStart !== this.isFirstStart ||
        !questionGroup.sessionConfig.equals(this.sessionConfig)) {
        return false;
      }
      if (questionGroup.questionList.length === this.questionList.length) {
        let allQuestionsEqual = false;
        for (let i = 0; i < this.questionList.length; i++) {
          if (this.questionList[i].equals(questionGroup.questionList[i])) {
            allQuestionsEqual = true;
          }
        }
        return allQuestionsEqual;
      }
    }
    return false;
  }

  /**
   * Quick way to insert a default question to the QuestionGroup instance.
   * @param {Number} [index] The index where the question should be inserted. If not passed, it will be added to the end of the questionList
   * @param type
   */
  addDefaultQuestion(index: number = -1, type: string = 'SingleChoiceQuestion'): void {
    if (typeof index === 'undefined' || index === -1 || index >= this.questionList.length) {
      index = this.questionList.length;
    }
    const questionItem = questionReflection[type]({
      hashtag: this.hashtag,
      questionText: '',
      questionIndex: index,
      timer: 40,
      startTime: 0,
      answerOptionList: []
    });
    this.addQuestion(questionItem, index);
  }
}
