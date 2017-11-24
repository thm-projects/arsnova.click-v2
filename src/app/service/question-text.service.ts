import {EventEmitter, Injectable, Output} from '@angular/core';
import {parseGithubFlavoredMarkdown} from '../../lib/markdown/markdown';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../lib/default.settings';
import {IMathjaxResponse} from 'arsnova-click-v2-types/src/common';

@Injectable()
export class QuestionTextService {

  @Output() fire: EventEmitter<string | Array<string>> = new EventEmitter();
  private _inputCache = {};

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
    if (this._inputCache[value]) {
      return new Promise((resolve => resolve(this._inputCache[value])));
    }
    const matchForDollar = value.match(/( ?\${1,2}.*\$)/g);
    const matchForBlock = value.match(/(\\(.)*\\.*)/g);
    let result = value;
    let mathjaxValues = [];
    if (matchForDollar) {
      mathjaxValues = mathjaxValues.concat(matchForDollar);
    }
    if (matchForBlock) {
      mathjaxValues = mathjaxValues.concat(matchForBlock);
    }

    return new Promise((resolve) => {
      if (mathjaxValues.length) {
        this.parseMathjax(mathjaxValues).then((mathjaxRendered) => {
          mathjaxValues.forEach((mathjaxValue: string, index: number) => {
            result = result.replace(mathjaxValue, mathjaxRendered[index].svg);
          });
          result = parseGithubFlavoredMarkdown(result);
          this._inputCache[value] = result;
          resolve(result);
        });
      } else {
        result = parseGithubFlavoredMarkdown(result);
        this._inputCache[value] = result;
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
        if (allResults.filter(singleResult => !!singleResult).length === value.length) {
          this.fire.emit(allResults);
        }
      });
    });
  }

  getEmitter(): EventEmitter<string | Array<string>> {
    return this.fire;
  }

}