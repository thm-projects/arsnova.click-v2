import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from "../../service/footer-bar.service";
import {ActiveQuestionGroupService} from "app/service/active-question-group.service";
import {TranslateService} from "@ngx-translate/core";
import {FooterBarComponent} from "../../footer/footer-bar/footer-bar.component";
import {Http, RequestOptions, Headers} from "@angular/http";
import {DefaultSettings} from "../../service/settings.service";

@Component({
  selector: 'app-nickname-manager',
  templateUrl: './nickname-manager.component.html',
  styleUrls: ['./nickname-manager.component.scss']
})
export class NicknameManagerComponent implements OnInit, OnDestroy {
  get selectedCategory(): string {
    return this._selectedCategory;
  }
  get availableNicks() {
    return this._availableNicks;
  }

  private _apiEndPoint = `${DefaultSettings.httpApiEndpoint}/availableNicks/all`;
  private _availableNicks = {};
  private _selectedCategory = '';

  constructor(private activeQuestionGroupService: ActiveQuestionGroupService,
              private translateService: TranslateService,
              private footerBarService: FooterBarService,
              private http: Http) {
    this.footerBarService.replaceFooterElments([
      FooterBarComponent.footerElemBack
    ]);
  }

  availableNickCategories(): Array<string> {
    return Object.keys(this._availableNicks);
  }

  selectCategory(name: string): void {
    this._selectedCategory = name;
  }

  selectNick(name: string): void {
    this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.toggleSelectedNick(name);
  }

  hasSelectedNick(name: string): boolean {
    return this.activeQuestionGroupService.activeQuestionGroup.sessionConfig.nicks.hasSelectedNick(name);
  }

  hasSelectedCategory(category: string): boolean {
    return category === this._selectedCategory;
  }

  ngOnInit() {
    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const options = new RequestOptions(headers);
    this.http.get(`${this._apiEndPoint}`, options)
      .map(res => res.json())
      .subscribe(
        data => {
          this._availableNicks = data;
        },
        error => {
          console.log(error);
        }
      )
  }

  ngOnDestroy() {
    this.activeQuestionGroupService.persist();
  }

}
