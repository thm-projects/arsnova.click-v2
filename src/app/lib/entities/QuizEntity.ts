import { QuizState } from '../enums/QuizState';
import { QuizVisibility } from '../enums/QuizVisibility';
import { getQuestionForType } from '../QuizValidator';
import { MemberGroupEntity } from './member/MemberGroupEntity';
import { AbstractQuestionEntity } from './question/AbstractQuestionEntity';
import { SessionConfigurationEntity } from './session-configuration/SessionConfigurationEntity';

export class QuizEntity {
  public name: string;
  public currentQuestionIndex: number;
  public questionList: Array<AbstractQuestionEntity>;
  public sessionConfig: SessionConfigurationEntity;
  public state: QuizState;
  public expiry: Date;
  public currentStartTimestamp: number;
  public memberGroups: Array<MemberGroupEntity>;
  public visibility: QuizVisibility;
  public description: string;

  constructor(props) {
    this.name = props.name;
    this.currentQuestionIndex = props.currentQuestionIndex;
    this.questionList = (props.questionList || []).map(question => getQuestionForType(question.TYPE, question));
    this.sessionConfig = new SessionConfigurationEntity(props.sessionConfig);
    this.state = props.state;
    this.expiry = props.expiry;
    this.currentStartTimestamp = props.currentStartTimestamp;
    this.memberGroups = props.memberGroups;
  }

  public addQuestion(question: AbstractQuestionEntity, index: number = -1): AbstractQuestionEntity {
    if (index === -1 || index >= this.questionList.length) {
      this.questionList.push(question);
    } else {
      this.questionList.splice(index, 0, question);
    }
    return question;
  }

  public removeQuestion(index: number): void {
    if (index < 0 || index > this.questionList.length) {
      throw new Error('Invalid argument list for QuestionGroup.removeQuestion');
    }
    this.questionList.splice(index, 1);
  }

  public isValid(): boolean {
    let questionListValid = this.questionList.length > 0;
    this.questionList.forEach((question: AbstractQuestionEntity) => {
      if (questionListValid && !question.isValid()) {
        questionListValid = false;
      }
    });
    return questionListValid && this.sessionConfig.nicks.memberGroups.length !== 1;
  }

  public equals(questionGroup: QuizEntity): boolean {
    if (questionGroup.name !== this.name || !questionGroup.sessionConfig.equals(this.sessionConfig)) {
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
    return false;
  }
}
