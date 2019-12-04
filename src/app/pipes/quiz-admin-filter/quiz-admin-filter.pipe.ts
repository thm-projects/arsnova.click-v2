import { Pipe, PipeTransform } from '@angular/core';
import { checkABCDOrdering } from '../../lib/checkABCDOrdering';
import { QuizState } from '../../lib/enums/QuizState';
import { IAdminQuiz } from '../../lib/interfaces/quizzes/IAdminQuiz';

interface IFilterArgs {
  filterDemoQuiz?: boolean;
  filterAbcdQuiz?: boolean;
  filterActiveQuiz?: boolean;
  filterQuizName?: string;
}

@Pipe({
  name: 'quizAdminFilter',
  pure: false,
})
export class QuizAdminFilterPipe implements PipeTransform {

  public transform(value: Array<IAdminQuiz>, args: IFilterArgs): Array<IAdminQuiz> {
    if (!value || !Object.keys(args || {}).length) {
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
