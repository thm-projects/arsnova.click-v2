import { EventEmitter, Injectable } from '@angular/core';
import { IMathjaxResponse } from '../../lib/interfaces/IMathjaxResponse';
import { MathjaxApiService } from '../api/mathjax/mathjax-api.service';
import { CustomMarkdownService } from '../custom-markdown/custom-markdown.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionTextService {

  private _eventEmitter: EventEmitter<string | Array<string>> = new EventEmitter();

  public get eventEmitter(): EventEmitter<string | Array<string>> {
    return this._eventEmitter;
  }

  private _inputCache = {};

  constructor(private mathjaxApiService: MathjaxApiService, private customMarkdownService: CustomMarkdownService) {
  }

  public async change(value: string): Promise<void> {
    const result = await this.parseInput(value);
    this._eventEmitter.emit(result);
  }

  public async changeMultiple(value: Array<string>): Promise<void> {
    const allResults = [];
    await Promise.all(value.map(async (singleValue) => {
      allResults.push(await this.parseInput(singleValue));
    }));
    this._eventEmitter.emit(allResults);
  }

  private parseMathjax(value: Array<string>): Promise<Array<IMathjaxResponse>> {
    return this.mathjaxApiService.postMathjax({
      mathjax: JSON.stringify(value),
      format: 'TeX',
      output: 'svg',
    }).toPromise();
  }

  private parseInput(value: string): Promise<string> {
    if (this._inputCache[value]) {
      return new Promise((
        resolve => resolve(this._inputCache[value])
      ));
    }

    const matchForDollar = value.match(/(\${1,2}.*\$)/g);
    const matchForBlock = value.match(/(\\(.)*\\.*)/g);
    let result = value;
    let mathjaxValues = [];

    if (matchForDollar) {
      mathjaxValues = mathjaxValues.concat(matchForDollar);
    }
    if (matchForBlock) {
      mathjaxValues = mathjaxValues.concat(matchForBlock);
    }

    return new Promise(async (resolve) => {
      if (mathjaxValues.length) {
        const mathjaxRendered = await this.parseMathjax(mathjaxValues);
        result = this.customMarkdownService.parseGithubFlavoredMarkdown(result);

        mathjaxValues.forEach((mathjaxValue: string, index: number) => {
          result = result.replace(mathjaxValue, mathjaxRendered[index].svg);
        });

        this._inputCache[value] = result;
        resolve(result);

      } else {
        result = this.customMarkdownService.parseGithubFlavoredMarkdown(result);
        this._inputCache[value] = result;
        resolve(result);

      }
    });
  }

}
