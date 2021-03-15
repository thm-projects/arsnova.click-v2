import { Pipe, PipeTransform } from '@angular/core';
import { QuizEntity } from '../../lib/entities/QuizEntity';

@Pipe({
  name: 'quizFilter'
})
export class QuizFilterPipe implements PipeTransform {

  public transform(value: Array<QuizEntity>, searchValue: string): Array<QuizEntity> {
    if (!value || !searchValue) {
      return value;
    }

    return value.filter(v => v.name.trim().toLowerCase().includes(searchValue.trim().toLowerCase()));
  }

}
