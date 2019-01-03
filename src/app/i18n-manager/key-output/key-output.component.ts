import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filter } from '../../../lib/enums/enums';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';
import { ProjectLoaderService } from '../../service/project-loader/project-loader.service';

@Component({
  selector: 'app-key-output',
  templateUrl: './key-output.component.html',
  styleUrls: ['./key-output.component.scss'],
})
export class KeyOutputComponent {
  public static readonly TYPE = 'KeyOutputComponent';

  public scrollPos = 0;
  public readonly Math = Math;

  @Input() public filter = Filter.None;
  @Input() public searchFilter = '';

  private _selectedKey: string;

  get selectedKey(): string {
    return this._selectedKey;
  }

  set selectedKey(value: string) {
    this._selectedKey = value;
    this.changeEmitter.emit(this.languageLoaderService.parsedLangData.find(val => val.key === value));
  }

  @Output() private changeEmitter = new EventEmitter<Object>();

  constructor(public projectLoaderService: ProjectLoaderService, public languageLoaderService: LanguageLoaderService) {
  }

  public scrollHandler(event: Event): void {
    const pos = (<HTMLElement>event.target).scrollTop;

    if (this.scrollPos !== Math.floor(pos / 40)) {
      this.scrollPos = Math.floor(pos / 40);
    }
  }

  public selectKey(key: string): void {
    if (this.selectedKey === key) {
      this.selectedKey = undefined;
    } else {
      this.selectedKey = key;
    }
  }

  public hasEmptyKeys(elem): boolean {
    return this.getKeys(elem.value).length < this.getKeys(this.languageLoaderService.language).length;
  }

  public removeKey(key: string): void {
    this.languageLoaderService.parsedLangData.splice(this.languageLoaderService.parsedLangData.findIndex(val => val.key === key), 1);
    this.selectKey(undefined);
    this.languageLoaderService.changedData = true;
  }

  public getKeys(dataNode: object): Array<string> {
    if (!dataNode) {
      return [];
    }
    return Object.keys(dataNode).sort();
  }

}
