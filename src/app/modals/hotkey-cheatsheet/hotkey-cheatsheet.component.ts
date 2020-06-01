import { flatten } from '@angular/compiler';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hotkey-cheatsheet',
  templateUrl: './hotkey-cheatsheet.component.html',
  styleUrls: ['./hotkey-cheatsheet.component.scss'],
})
export class HotkeyCheatsheetComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'HotkeyCheatsheetComponent';

  private _isVisible = false;
  private _modalRef: NgbModalRef;
  private _pausedHotkeys: Array<Hotkey> = [];
  private readonly _destroy$ = new Subject();
  @ViewChild('modal') private readonly modal: TemplateRef<any>;

  public hotkeys: Array<Hotkey> = [];

  constructor(
    public hotkeysService: HotkeysService,
    private activeModal: NgbActiveModal,
    private ngbModal: NgbModal,
  ) {}

  public ngOnInit(): void {
    this.hotkeysService.cheatSheetToggle.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._isVisible = !this._isVisible;

      if (!this._isVisible) {
        return;
      }

      this.pauseHotkeys();
      this._modalRef = this.ngbModal.open(this.modal);

      this._modalRef.result.finally(() => {
        this._isVisible = false;
        this.unpauseHotkeys();
      });
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public dismiss(): void {
    this._modalRef.close();
  }

  public formatCombo(combo: string | string[]): Array<string> {
    if (Array.isArray(combo)) {
      return flatten(combo.map(c => c.split('+').map(splitted => splitted.toUpperCase().trim())));
    }

    return combo.split('+').map(splitted => splitted.toUpperCase().trim());
  }

  private pauseHotkeys(): void {
    this.hotkeys = this.hotkeysService.hotkeys.concat(this.hotkeysService.pausedHotkeys);
    const hotkeysToPause = this.hotkeys;

    this.hotkeysService.pause(hotkeysToPause);
    this._pausedHotkeys = hotkeysToPause;
  }

  private unpauseHotkeys(): void {
    if (this._pausedHotkeys) {
      this.hotkeysService.unpause(this._pausedHotkeys);
      this._pausedHotkeys = null;
    }
  }
}
