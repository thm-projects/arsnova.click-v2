import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Filter } from '../../lib/enums/enums';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';

@Component({
  selector: 'app-key-output',
  templateUrl: './key-output.component.html',
  styleUrls: ['./key-output.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyOutputComponent {
  public static readonly TYPE = 'KeyOutputComponent';
  public readonly throttle = 0;
  public readonly scrollDistance = 4;
  public visibleData = 20;
  @Input() public filter = Filter.None;
  @Input() public searchFilter = '';
  @Input() public unusedKeyFilter: boolean;

  constructor(public languageLoaderService: LanguageLoaderService, private cd: ChangeDetectorRef) {
    this.languageLoaderService.changed.subscribe(() => this.cd.markForCheck());
  }

  public selectKey(data: { key: string; value: { [key: string]: string } }): void {
    if (this.languageLoaderService.selectedKey?.key === data.key) {
      this.languageLoaderService.selectedKey = null;
    } else {
      this.languageLoaderService.selectedKey = data;
    }
  }

  public hasEmptyKeys(elem): boolean {
    return this.getKeys(elem.value).length < this.getKeys(this.languageLoaderService.language).length;
  }

  public removeKey(key: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm('Really remove this key?')) {
      return;
    }

    this.languageLoaderService.parsedLangData.splice(this.languageLoaderService.parsedLangData.findIndex(val => val.key === key), 1);
    this.selectKey(null);
    this.languageLoaderService.changedData = true;
  }

  public getKeys(dataNode: object): Array<string> {
    if (!dataNode) {
      return [];
    }
    return Object.keys(dataNode).sort();
  }

  public onScrollDown(): void {
    this.visibleData += 20;
    this.cd.markForCheck();
  }
}
