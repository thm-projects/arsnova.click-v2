import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';

@Component({
  selector: 'app-add-mode',
  templateUrl: './add-mode.component.html',
  styleUrls: ['./add-mode.component.scss'],
})
export class AddModeComponent {
  public static readonly TYPE = 'AddModeComponent';

  private scrollY = window.scrollY;

  public key = '';
  public value = {};

  constructor(private activeModal: NgbActiveModal, public languageLoaderService: LanguageLoaderService) {
  }

  public dismiss(result?): void {
    window.scroll(0, this.scrollY);
    this.activeModal.dismiss(result);
  }

  public updateKey(event, langRef): void {
    this.value[langRef.toLowerCase()] = event.target.value;
  }

  public getKeys(dataNode: object): Array<string> {
    if (!dataNode) {
      return [];
    }
    return Object.keys(dataNode).sort();
  }

  public save(): void {
    if (!this.key.length) {
      return;
    }

    this.languageLoaderService.parsedLangData.push({
      key: this.key,
      value: this.value,
    });
    this.languageLoaderService.changedData = true;

    window.scroll(0, this.scrollY);
    this.activeModal.close();
  }

  public hasValues(): boolean {
    return Boolean(Object.values(this.value).filter(v => Boolean(v)).length) && this.key.length > 0;
  }
}
