import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMathjaxResponse } from 'arsnova-click-v2-types/dist/common';
import { Observable } from 'rxjs/index';
import { DefaultSettings } from '../../../../lib/default.settings';

@Injectable({
  providedIn: 'root',
})
export class MathjaxApiService {

  constructor(private http: HttpClient) { }

  public MATHJAX_POST_URL(): string {
    return `${DefaultSettings.httpLibEndpoint}/mathjax`;
  }

  public postMathjax(data: object): Observable<Array<IMathjaxResponse>> {
    return this.http.post<Array<IMathjaxResponse>>(this.MATHJAX_POST_URL(), data);
  }
}
