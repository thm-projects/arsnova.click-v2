import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';

@Injectable({
  providedIn: 'root',
})
export class StatisticsApiService {

  constructor(
    private http: HttpClient,
  ) { }

  public BASE_STATISTICS_GET_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}`;
  }

  public BASE_STATISTICS_OPTIONS_URL(): string {
    return this.BASE_STATISTICS_GET_URL();
  }

  public getBaseStatistics(): Observable<any> {
    return this.http.get(this.BASE_STATISTICS_GET_URL());
  }

  public getBaseAppStatistics(): Observable<any> {
    return this.http.get(`${DefaultSettings.httpLibEndpoint}/statistics`);
  }

  public optionsBaseStatistics(): Observable<void> {
    return this.http.options<void>(this.BASE_STATISTICS_OPTIONS_URL());
  }
}
