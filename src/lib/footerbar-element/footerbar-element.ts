import { Observable } from 'rxjs';
import { IFooterBarElement } from './interfaces';

export class FooterbarElement implements IFooterBarElement {
  get selectable(): boolean {
    return this._selectable;
  }

  get showIntro(): boolean {
    return this._showIntro;
  }

  get id(): string {
    return this._id;
  }

  get iconClass(): string {
    return this._iconClass;
  }

  get textClass(): string {
    return this._textClass;
  }

  get textName(): string {
    return this._textName;
  }

  private _onClickCallback: Function;

  get onClickCallback(): Function {
    return this._onClickCallback;
  }

  set onClickCallback(value: Function) {
    this._restoreOnClickCallback = this._onClickCallback;
    this._onClickCallback = value;
  }

  private _linkTarget: Function | Array<string> | string;

  get linkTarget(): Function | Array<string> | string {
    return this._linkTarget;
  }

  set linkTarget(value: Function | Array<string> | string) {
    this._linkTarget = value;
  }

  private _isActive: boolean;

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get queryParams(): object {
    return this._queryParams;
  }

  private _restoreOnClickCallback: Function;
  private readonly _id: string;
  private readonly _iconClass: string;
  private readonly _textClass: string;
  private readonly _textName: string;
  private readonly _selectable: boolean;
  private readonly _showIntro: boolean;
  private readonly _queryParams: object;

  constructor({ id, iconClass, textClass, textName, selectable, showIntro, isActive, linkTarget, queryParams }: IFooterBarElement, onClickCallback?: Function) {
    this._id = id;
    this._iconClass = iconClass;
    this._textClass = textClass;
    this._textName = textName;
    this._selectable = selectable;
    this._showIntro = showIntro;
    if (isActive instanceof Observable) {
      (
        <Observable<boolean>>isActive
      ).subscribe(val => this._isActive = val);
    } else {
      this._isActive = !!isActive;
    }

    this._linkTarget = linkTarget;
    this._queryParams = queryParams;
    this._onClickCallback = onClickCallback;
  }

  public restoreClickCallback(): void {
    if (!this._restoreOnClickCallback) {
      return;
    }
    this._onClickCallback = this._restoreOnClickCallback;
  }
}
