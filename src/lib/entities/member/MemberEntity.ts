import { IQuizResponse } from '../../interfaces/quizzes/IQuizResponse';
import { ICasData } from '../../interfaces/users/ICasData';

export class MemberEntity {
  public currentQuizName: string;
  public name: string;
  public id: string;
  public groupName: string;
  public colorCode: string;
  public responses: Array<IQuizResponse>;
  public casProfile: ICasData;
  public ticket: string;

  constructor(data) {
    this.currentQuizName = data.currentQuizName;
    this.name = data.name;
    this.id = data.id;
    this.groupName = data.groupName;
    this.colorCode = data.colorCode;
    this.responses = data.responses;
    this.casProfile = data.casProfile;
    this.ticket = data.ticket;
  }
}
