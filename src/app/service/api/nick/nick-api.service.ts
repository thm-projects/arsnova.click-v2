import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { IAvailableNicks } from '../../../lib/interfaces/IAvailableNicks';

@Injectable({
  providedIn: 'root',
})
export class NickApiService {

  constructor(private http: HttpClient) { }

  public GET_PREDEFINED_NICKS_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/nicks/predefined`;
  }

  public getPredefinedNicks(): Observable<IAvailableNicks> {
    return this.http.get<IAvailableNicks>(this.GET_PREDEFINED_NICKS_URL());
  }
}
