import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMessage } from 'arsnova-click-v2-types/src/common';
import { Observable } from 'rxjs/index';
import { DefaultSettings } from '../../../../lib/default.settings';

@Injectable({
  providedIn: 'root',
})
export class ThemesApiService {

  constructor(
    private http: HttpClient,
  ) { }

  public THEMES_GET_URL(): string {
    return `${DefaultSettings.httpApiEndpoint}/themes`;
  }

  public THEMES_LINK_IMAGES_GET_URL(theme: string): string {
    return `${DefaultSettings.httpLibEndpoint}/linkImages/${theme}`;
  }

  public getThemes(): Observable<IMessage> {
    return this.http.get<IMessage>(this.THEMES_GET_URL());
  }

  public getLinkImages(theme: string): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.THEMES_LINK_IMAGES_GET_URL(theme));
  }
}
