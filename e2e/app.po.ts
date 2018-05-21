import { browser, by, element } from 'protractor';
import { promise } from 'selenium-webdriver';

export class FrontendPage {
  public navigateTo(): promise.Promise<any> {
    return browser.get('/');
  }

  public getParagraphText(): promise.Promise<string> {
    return element(by.css('app-root h1')).getText();
  }
}
