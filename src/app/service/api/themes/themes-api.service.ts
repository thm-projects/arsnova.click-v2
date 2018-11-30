import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';

@Injectable({
  providedIn: 'root',
})
export class ThemesApiService {

  constructor(private http: HttpClient) { }

  public THEMES_PREVIEW_GET_URL(id: string, langRef: string): string {
    return `/assets/images/theme/${id}/preview_${langRef}.jpeg`;
  }

  public THEMES_LINK_IMAGES_GET_URL(theme: string): string {
    return `/assets/meta/${theme}/linkNodes.json`;
  }

  public getLinkImages(theme: string): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.THEMES_LINK_IMAGES_GET_URL(theme));
  }
}