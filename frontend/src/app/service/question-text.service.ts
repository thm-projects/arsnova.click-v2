import {EventEmitter, Injectable, Output} from '@angular/core';
import {parseGithubFlavoredMarkdown} from "../../lib/markdown/markdown";

@Injectable()
export class QuestionTextService {

  @Output() fire: EventEmitter<string[]> = new EventEmitter();
  public currentValue: string[] = [''];

  constructor() {
  }

  change(value: string): void {
    const result = value.split('\n');
    parseGithubFlavoredMarkdown(result);
    console.log(result);
    this.currentValue = result;
    this.fire.emit(result);
  }

  getEmitter(): EventEmitter<string[]> {
    return this.fire;
  }

}
