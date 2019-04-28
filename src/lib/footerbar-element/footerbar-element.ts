import { IFooterBarElement } from './interfaces';

export class FooterbarElement implements IFooterBarElement {
  get introTranslate(): string {
    return this._introTranslate;
  }

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

  private _linkTarget: Function | Array<string>;

  get linkTarget(): Function | Array<string> {
    return this._linkTarget;
  }

  set linkTarget(value: Function | Array<string>) {
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

  private _isLoading: boolean;

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  private readonly _introTranslate: string;
  private _restoreOnClickCallback: Function;
  private readonly _id: string;
  private readonly _iconClass: string;
  private readonly _textClass: string;
  private readonly _textName: string;
  private readonly _selectable: boolean;
  private readonly _showIntro: boolean;
  private readonly _queryParams: object;

  constructor(
    { id, iconClass, textClass, textName, selectable, showIntro, introTranslate, isActive, linkTarget, queryParams, isLoading }: IFooterBarElement,
    onClickCallback?: Function,
  ) {
    this._id = id;
    this._iconClass = iconClass;
    this._textClass = textClass;
    this._textName = textName;
    this._selectable = selectable;
    this._showIntro = showIntro;
    this._introTranslate = introTranslate;
    this._isActive = isActive;
    this._linkTarget = linkTarget;
    this._queryParams = queryParams;
    this._isLoading = isLoading;
    this.onClickCallback = onClickCallback;
  }

  public restoreClickCallback(): void {
    if (!this._restoreOnClickCallback) {
      return;
    }
    this._onClickCallback = this._restoreOnClickCallback;
  }
}
