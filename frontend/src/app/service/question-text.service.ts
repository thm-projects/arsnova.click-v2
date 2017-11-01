import {EventEmitter, Injectable, Output} from '@angular/core';
import {parseGithubFlavoredMarkdown} from '../../lib/markdown/markdown';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from './settings.service';
import {IMathjaxResponse} from '../../lib/common.interfaces';

@Injectable()
export class QuestionTextService {

  @Output() fire: EventEmitter<string | Array<string>> = new EventEmitter();
  public currentValue = '';

  constructor(private http: HttpClient) {
  }

  parseMathjax(value: Array<string>) {
    return new Promise<Array<IMathjaxResponse>>(resolve => {
      this.http.post(`${DefaultSettings.httpLibEndpoint}/mathjax`, {
        mathjax: JSON.stringify(value),
        format: 'TeX',
        output: 'svg'
      }).subscribe((data: any) => {
        resolve(data);
      });
    });
  }

  parseInput(value: string) {
    const matchForDollar = value.match(/( ?\${1,2}\s.*)/g);
    const matchForBlock = value.match(/(\\(.)*\\.*)/g);
    let result = '';
    let mathjaxValues = [];
    if (matchForDollar) {
      mathjaxValues = mathjaxValues.concat(matchForDollar);
    }
    if (matchForBlock) {
      mathjaxValues = mathjaxValues.concat(matchForBlock);
    }

    result = parseGithubFlavoredMarkdown(value);
    return new Promise((resolve) => {
      if (mathjaxValues.length) {
        this.parseMathjax(mathjaxValues).then((mathjaxRendered) => {
          mathjaxValues.forEach((mathjaxValue: string, index: number) => {
            // Escape the mathjax html characters so that we can find it in the parsed output of marked
            const escapedMathjaxValue = mathjaxValue.replace(/&/g, '&amp;')
                                                    .replace(/\\\\/g, '\\');
            result = result.replace(escapedMathjaxValue, mathjaxRendered[index].svg);
          });
          resolve(result);
        });
      } else {
        resolve(result);
      }
    });
  }

  change(value: string): void {
    this.parseInput(value).then((result: string) => {
      this.fire.emit(result);
    });
  }

  changeMultiple(value: Array<string>): void {
    const allResults = [];
    value.forEach((singleValue, index) => {
      this.parseInput(singleValue).then((result: string) => {
        allResults[index] = result;
        if (allResults.length === value.length) {
          this.fire.emit(allResults);
        }
      });
    });
  }

  getEmitter(): EventEmitter<string | Array<string>> {
    return this.fire;
  }

}
