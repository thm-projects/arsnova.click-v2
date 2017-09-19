import {Injectable} from '@angular/core';
import {FooterbarElement} from '../footer/footer-bar/footer-bar.component';

@Injectable()
export class FooterBarService {
  get footerElements(): Array<FooterbarElement> {
    return this._footerElements;
  }

  private _footerElements: Array<FooterbarElement> = [];

  constructor() {
  }

  public addFooterElement(element: FooterbarElement) {
    this._footerElements.push(element);
  }

  public replaceFooterElments(elements: Array<FooterbarElement>) {
    this._footerElements = elements;
  }

  public removeFooterElement(element: FooterbarElement) {
    this._footerElements.splice(this._footerElements.indexOf(element), 1);
  }

}
