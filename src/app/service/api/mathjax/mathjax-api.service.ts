import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { IMathjaxResponse } from '../../../lib/interfaces/IMathjaxResponse';

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
