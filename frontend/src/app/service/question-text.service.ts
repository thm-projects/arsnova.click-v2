import {EventEmitter, Injectable, Output} from '@angular/core';
import {parseGithubFlavoredMarkdown} from '../../lib/markdown/markdown';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from './settings.service';
import {IMathjaxResponse} from '../../lib/common.interfaces';

@Injectable()
export class QuestionTextService {

  @Output() fire: EventEmitter<string> = new EventEmitter();
  public currentValue = '';
  public mathjaxStyles = '';

  constructor(private http: HttpClient) {
  }

  parseMathjax(value: Array<string>) {
    return new Promise<Array<IMathjaxResponse>>(resolve => {
      this.http.post(`${DefaultSettings.httpLibEndpoint}/mathjax`, {
        mathjax: JSON.stringify(value),
        format: 'TeX',
        output: 'html'
      }).subscribe((data: any) => {
        resolve(data);
      });
    });
  }

  change(value: string): void {
    let mathjaxValues = value.match(/( ?\${1,2}\s.*)/g);
    mathjaxValues = mathjaxValues.concat(value.match(/(\\(.)*\\.*)/g));
    this.currentValue = parseGithubFlavoredMarkdown(value);
    this.parseMathjax(mathjaxValues).then((mathjaxRendered) => {
      mathjaxValues.forEach((mathjaxValue: string, index: number) => {
        // Escape the mathjax html characters so that we can find it in the parsed output of marked
        const escapedMathjaxValue = mathjaxValue.replace(/&/g, '&amp;')
                                                .replace(/\\\\/g, '\\');
        this.mathjaxStyles = mathjaxRendered[index].css;
        this.currentValue = this.currentValue.replace(escapedMathjaxValue, mathjaxRendered[index].html);
      });
      this.fire.emit(this.currentValue);
    });
  }

  getEmitter(): EventEmitter<string> {
    return this.fire;
  }

}
