import {EventEmitter, Injectable, Output} from '@angular/core';
import {parseGithubFlavoredMarkdown} from '../../lib/markdown/markdown';

@Injectable()
export class QuestionTextService {

  @Output() fire: EventEmitter<string> = new EventEmitter();
  public currentValue = '';

  constructor() {
  }

  change(value: string): void {
    this.currentValue = parseGithubFlavoredMarkdown(value);
    this.fire.emit(this.currentValue);
  }

  getEmitter(): EventEmitter<string> {
    return this.fire;
  }

}
