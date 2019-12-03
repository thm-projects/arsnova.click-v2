import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quizAdminFilter',
})
export class QuizAdminFilterPipeMock implements PipeTransform {
  public transform(value: any, ...args): any {
    return value;
  }
}
