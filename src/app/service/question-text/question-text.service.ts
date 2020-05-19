import { EventEmitter, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

  public change(value: string): Observable<string> {
    return this.parseInput(value).pipe(tap(result => this._eventEmitter.emit(result)));
  }

  public changeMultiple(value: Array<string>): Observable<Array<string>> {
    return forkJoin(value.map(singleValue => this.parseInput(singleValue))).pipe(tap(allResults => this._eventEmitter.emit(allResults)));
  }

  private parseMathjax(value: Array<string>): Observable<Array<IMathjaxResponse>> {
    return this.mathjaxApiService.postMathjax({
      mathjax: JSON.stringify(value),
      format: 'TeX',
      output: 'svg',
    });
  }

  private parseInput(value: string): Observable<string> {
    if (!value) {
      return of(null);
    }

    if (this._inputCache[value]) {
      return of(this._inputCache[value]);
    }

    const matchForDollar = value.match(/(\${1,2}\n?([^\$]*)\n?\${1,2})/gi);
    let result = value;
    let mathjaxValues = [];

    if (matchForDollar) {
      mathjaxValues = mathjaxValues.concat(matchForDollar);
    }
    result = this.customMarkdownService.parseGithubFlavoredMarkdown(result);

    if (!mathjaxValues.length) {
      this._inputCache[value] = result;
      return of(result);
    }

    return this.parseMathjax(mathjaxValues).pipe(map(mathjaxRendered => {

      mathjaxValues.forEach((mathjaxValue: string, index: number) => {
        if (!mathjaxRendered[index]?.svg || !mathjaxValue.match(/(\${1,2}\n?([^\$]*)\n?\${1,2})/)) {
          return;
        }

        const htmlNode = mathjaxValue.startsWith('$$') ? 'div' : 'span';
        const htmlString = `<${htmlNode}>${mathjaxRendered[index].svg}</${htmlNode}>`;
        const searchStr = this.customMarkdownService.parseGithubFlavoredMarkdown(mathjaxValue).trim();
        const searchStrWithoutParagraph = searchStr.replace('<p>', '').replace('</p>', '').trim();

        result = result.replace(searchStrWithoutParagraph, htmlString);
        result = result.replace(this.customMarkdownService.parseGithubFlavoredMarkdown(mathjaxValue), htmlString);
      });

      this._inputCache[value] = result;
      return result;
    }));
  }

}
