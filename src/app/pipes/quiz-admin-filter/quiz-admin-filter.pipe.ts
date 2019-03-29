import { Pipe, PipeTransform } from '@angular/core';
import { checkABCDOrdering } from '../../../lib/checkABCDOrdering';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { QuizState } from '../../../lib/enums/QuizState';

@Pipe({
  name: 'quizAdminFilter',
})
export class QuizAdminFilterPipe implements PipeTransform {

  public transform(value: Array<QuizEntity>, args?: any): any {
    if (!value || !value.length || !args || !Object.keys(args).length) {
      return value;
    }

    return value.filter(quiz => {
      let isFiltered = true;

      if (isFiltered && !args.filterDemoQuiz && quiz.name.trim().toLowerCase().startsWith('demo quiz')) {
        isFiltered = false;
      }

      if (isFiltered && !args.filterAbcdQuiz && checkABCDOrdering(quiz.name.split(' ')[0])) {
        isFiltered = false;
      }

      if (isFiltered && args.filterQuizName && args.filterQuizName.length) {
        const match = quiz.name.trim().toLowerCase().match(new RegExp(args.filterQuizName, 'i'));
        isFiltered = match && match.length > 0;
      }

      if (isFiltered && args.filterActiveQuiz) {
        isFiltered = [QuizState.Active, QuizState.Running].includes(quiz.state);
      }

      return isFiltered;
    });
  }
}
