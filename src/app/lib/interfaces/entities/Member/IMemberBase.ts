import { IQuizResponse } from '../../quizzes/IQuizResponse';

export interface IMemberBase {
  name: string;
  groupName: string;
  currentQuizName: string;
  colorCode?: string;
  ticket?: string;
  responses?: Array<IQuizResponse>;
  isActive?: boolean;
}

