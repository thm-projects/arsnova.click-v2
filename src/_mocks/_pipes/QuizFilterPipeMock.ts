import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quizFilter',
})
export class QuizFilterPipeMock implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}
