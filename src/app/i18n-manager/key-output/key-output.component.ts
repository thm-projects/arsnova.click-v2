import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';
import { ProjectLoaderService } from '../../service/project-loader/project-loader.service';
import { FILTER } from '../../shared/enums';

@Component({
  selector: 'app-key-output',
  templateUrl: './key-output.component.html',
  styleUrls: ['./key-output.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyOutputComponent {
  public static readonly TYPE = 'KeyOutputComponent';

  public readonly filters = FILTER;
  @Input() public changedData;
  public scrollPos = 0;

  public readonly Math = Math;
  @Input() public filter = FILTER.NONE;
  @Input() public searchFilter = '';

  private _selectedIndex: number;

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  set selectedIndex(value: number) {
    this._selectedIndex = value;
    this.changeEmitter.emit(value);
  }

  @Output() private changeEmitter = new EventEmitter<Object>();
  @Output() private changeLangEmitter = new EventEmitter<string>();

  constructor(public projectLoaderService: ProjectLoaderService, public languageLoaderService: LanguageLoaderService) {
  }

  public scrollHandler(event: Event): void {
    const pos = (
      <HTMLElement>event.target
    ).scrollTop;

    if (this.scrollPos !== Math.floor(pos / 40)) {
      this.scrollPos = Math.floor(pos / 40);
    }
  }

  public selectKey(index: number): void {
    if (this.selectedIndex === index) {
      this.selectedIndex = undefined;
    } else {
      this.selectedIndex = index;
    }
  }

  public hasEmptyKeys(elem): boolean {
    return this.getKeys(elem.value).length < this.getKeys(this.languageLoaderService.LANGUAGE).length;
  }

  public removeKey(target: any): void {
    this.languageLoaderService.parsedLangData.splice(this.languageLoaderService.parsedLangData.findIndex(elem => elem === target), 1);
  }

  public getKeys(dataNode: object): Array<string> {
    if (!dataNode) {
      return [];
    }
    return Object.keys(dataNode).sort();
  }

}
