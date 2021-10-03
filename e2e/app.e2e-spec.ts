import { FrontendPage } from './app.po';

describe('Home: Basics', () => {
  let page: FrontendPage;

  beforeEach(() => {
    page = new FrontendPage();
  });

  afterEach(() => {
    page.clearLocalStorage();
    page.clearSessionStorage();
  });

  it('should display the antworte✦jetzt slogan', () => {
    page.navigateToBaseUrl();
    expect(page.getArsnovaClickSlogan()).toEqual('a r s n o v a . c l i c k');
  });

  describe('Home: Create Quiz', () => {

    beforeEach(() => {
      page = new FrontendPage();
    });

    afterEach(() => {
      page.clearLocalStorage();
      page.clearSessionStorage();
    });

    it('should be able to create a new demo quiz and be redirected to the quiz lobby', () => {
      page.navigateToBaseUrl();
      page.fillInDemoQuiz();
      expect(page.getUrl()).toEqual(`${page.getHost()}/quiz/flow/lobby`);
    });

    it('should be able to create a new abcd quiz and be redirected to the quiz lobby', () => {
      page.navigateToBaseUrl();
      page.fillInAbcdQuiz();
      expect(page.getUrl()).toEqual(`${page.getHost()}/quiz/flow/lobby`);
    });

    it('should be able to create a new quiz and be redirected to the quiz manager', () => {
      page.navigateToBaseUrl();
      page.fillInDefaultQuiz();
      expect(page.getUrl()).toEqual(`${page.getHost()}/quiz/manager/overview`);
    });
  });
});
