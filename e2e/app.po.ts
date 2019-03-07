import { browser, by, element, ElementFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

export class FrontendPage {
  public navigateToBaseUrl(): promise.Promise<any> {
    return browser.get('/');
  }

  public getUrl(): promise.Promise<string> {
    return browser.getCurrentUrl();
  }

  public getHost(): string {
    return 'http://localhost:4201';
  }

  public getArsnovaClickSlogan(): promise.Promise<string> {
    return element(by.css('app-root h1')).getText();
  }

  public fillInDemoQuiz(): promise.Promise<any[]> {
    return promise.all([
      this.getQuiznameInputElement().sendKeys('Demo Quiz'), this.getPasswordInputElement().sendKeys('abc'), this.getAddDemoQuizButton().click(),
    ]);
  }

  public fillInAbcdQuiz(): promise.Promise<any[]> {
    return promise.all([
      this.getQuiznameInputElement().sendKeys('ABCD'), this.getPasswordInputElement().sendKeys('abc'), this.getAddAbcdQuizButton().click(),
    ]);
  }

  public fillInDefaultQuiz(): promise.Promise<any[]> {
    return promise.all([
      this.getQuiznameInputElement().sendKeys('testquiz'), this.getPasswordInputElement().sendKeys('abc'), this.getAddSessionButton().click(),
    ]);
  }

  public getAvailableQuizzesDialogCloseButton(): ElementFinder {
    return element(by.css('.close.cursor-pointer'));
  }

  public clearLocalStorage(): void {
    browser.executeScript('window.localStorage.clear();');
  }

  public clearSessionStorage(): void {
    browser.executeScript('window.sessionStorage.clear();');
  }

  private getQuiznameInputElement(): ElementFinder {
    return element(by.css('#name-input-field'));
  }

  private getPasswordInputElement(): ElementFinder {
    return element(by.css('#server-password-input-field'));
  }

  private getAddSessionButton(): ElementFinder {
    return element(by.css('#addSession'));
  }

  private getAddDemoQuizButton(): ElementFinder {
    return element(by.css('#runDemoQuizSession'));
  }

  private getAddAbcdQuizButton(): ElementFinder {
    return element(by.css('#runABCDQuizSession'));
  }
}
