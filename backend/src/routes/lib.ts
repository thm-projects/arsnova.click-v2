import {NextFunction, Request, Response, Router} from 'express';
import * as mjAPI from 'mathjax-node';
import * as request from 'request';
import {IQuestion, IQuestionGroup} from '../interfaces/questions/interfaces';
import * as fs from 'fs';
import {DatabaseTypes, DbDao} from '../db/DbDao';
import {IAnswerOption} from '../interfaces/answeroptions/interfaces';
import * as sha256 from 'crypto-js/sha256';
import * as Hex from 'crypto-js/enc-hex';
import * as CAS from 'cas';
import * as crypto from 'crypto';

const casSettings = {base_url: 'https://cas.thm.de/cas', service: 'arsnova_click_v2'};
const cas = new CAS(casSettings);

export class LibRouter {
  get router(): Router {
    return this._router;
  }

  private _router: Router;

  /**
   * Initialize the LibRouter
   */
  constructor() {
    this._router = Router();
    this.init();

    mjAPI.start();
    mjAPI.config({
      // determines whether Message.Set() calls are logged
      displayMessages: false,
      // determines whether error messages are shown on the console
      displayErrors: true,
      // determines whether "unknown characters" (i.e., no glyph in the configured fonts) are saved in the error array
      undefinedCharError: true,
      // a convenience option to add MathJax extensions
      extensions: '',
      // for webfont urls in the CSS for HTML output
      fontURL: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/fonts/HTML-CSS',
      // default MathJax config
      MathJax: {
        jax: ['input/TeX', 'input/MathML', 'input/AsciiMath', 'output/CommonHTML'],
        extensions: [
          'tex2jax.js', 'mml2jax.js', 'asciimath2jax.js', 'AssistiveMML.js'
        ],
        TeX: {
          extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
        },
        tex2jax: {
          processEscapes: true,
          processEnvironments: true,
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
        }
      }
    });
  }

  /**
   * GET all Data.
   * TODO: Return REST Spec here
   */
  public getAll(req: Request, res: Response, next: NextFunction): void {
    res.send({
      paths: [
        {name: '/mathjax', description: 'Returns the rendered output of a given mathjax string'},
        {name: '/mathjax/example/first', description: 'Returns the rendered output of an example mathjax MathMl string as svg'},
        {name: '/mathjax/example/second', description: 'Returns the rendered output of an example mathjax TeX string as mml'},
        {name: '/mathjax/example/third', description: 'Returns the rendered output of an example mathjax TeX string as html and css'},
      ]
    });
  }

  public getFirstMathjaxExample(req: Request, res: Response, next: NextFunction): void {
    mjAPI.typeset({
      math: `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" mathcolor="black">
  <mrow>
    <mi>f</mi>
    <mrow>
      <mo>(</mo>
      <mi>a</mi>
      <mo>)</mo>
    </mrow>
  </mrow>
  <mo>=</mo>
  <mrow>
    <mfrac>
      <mn>1</mn>
      <mrow>
        <mn>2</mn>
        <mi>&#x3C0;</mi>
        <mi>i</mi>
      </mrow>
    </mfrac>
    <msub>
      <mo>&#x222E;</mo>
      <mrow>
        <mi>&#x3B3;</mi>
      </mrow>
    </msub>
    <mfrac>
      <mrow>
        <mi>f</mi>
        <mo>(</mo>
        <mi>z</mi>
        <mo>)</mo>
      </mrow>
      <mrow>
        <mi>z</mi>
        <mo>&#x2212;</mo>
        <mi>a</mi>
      </mrow>
    </mfrac>
    <mi>d</mi>
    <mi>z</mi>
  </mrow>
</math>`,
      format: 'MathML', // 'inline-TeX', 'MathML'
      svg: true, //  svg:true, mml: true
    }, function (data) {
      if (!data.errors) {
        res.send(data);
      }
    });
  }

  public getSecondMathjaxExample(req: Request, res: Response, next: NextFunction): void {
    mjAPI.typeset({
      math: `\\begin{align} a_1& =b_1+c_1\\\\ a_2& =b_2+c_2-d_2+e_2 \\end{align}`,
      format: 'TeX', // 'inline-TeX', 'MathML'
      mml: true, //  svg:true, mml: true
    }, function (data) {
      if (!data.errors) {
        res.send(data);
      }
    });
  }

  public getThirdMathjaxExample(req: Request, res: Response, next: NextFunction): void {
    mjAPI.typeset({
      math: '\\begin{align} \\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} & = ' +
            '\\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\end{align}',
      format: 'TeX', // 'inline-TeX', 'MathML'
      html: true, //  svg:true, mml: true
      css: true, //  svg:true, mml: true
      svg: true
    }, function (data) {
      if (!data.errors) {
        res.send(data);
      }
    });
  }

  public renderMathjax(req: Request, res: Response, next: NextFunction): void {
    if (!req.body.mathjax || !req.body.format || !req.body.output) {
      res.writeHead(500);
      res.send(`Malformed request received -> ${req.body}`);
    }
    const mathjaxArray = JSON.parse(req.body.mathjax);
    const result = [];
    if (mathjaxArray) {
      mathjaxArray.forEach((mathjaxPlain, index) => {
        const dbResult = DbDao.read(DatabaseTypes.mathjax, mathjaxPlain);
        if (dbResult) {
          result.push(dbResult);
          return;
        }
        mjAPI.typeset({
          math: mathjaxPlain.replace(/ ?\${1,2} ?/g, ''),
          format: req.body.format,
          html: req.body.output === 'html',
          css: req.body.output === 'html',
          svg: req.body.output === 'svg',
          mml: req.body.output === 'mml'
        }).then(data => {
          result.push(data);
          DbDao.create(DatabaseTypes.mathjax, data, mathjaxPlain);
          if (index === mathjaxArray.length - 1) {
            res.send(JSON.stringify(result));
          }
        });
      });
    }
  }

  public cacheQuizAssets(req: Request, res: Response, next: NextFunction): void {
    if (!req.body.quiz) {
      res.writeHead(500);
      res.end(`Malformed request received -> ${req.body}`);
    }
    const quiz: IQuestionGroup = req.body.quiz;
    quiz.questionList.forEach((question: IQuestion) => {
      this.matchTextToAssetsDb(question.questionText);
      question.answerOptionList.forEach((answerOption: IAnswerOption) => {
        this.matchTextToAssetsDb(answerOption.answerText);
      });
    });
    res.send({
      status: 'STATUS:SUCCESSFULL',
      step: 'CACHE:QUIZ_ASSETS',
      payload: {}
    });
  }

  private matchTextToAssetsDb(value: string) {
    const acceptedFileTypes = [/image\/*/];
    const matchedValue = value.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
    if (matchedValue) {
      matchedValue.forEach((matchedValueElement: string) => {
        const digest = Hex.stringify(sha256(matchedValueElement));
        const path = `${__dirname}/../../cache/${digest}`;
        if (fs.existsSync(path)) {
          return;
        }
        if (!matchedValueElement.startsWith('http')) {
          matchedValueElement = `http://${matchedValueElement}`;
        }
        const req = request(matchedValueElement);
        req.on('response', (response) => {
          const contentType = response.headers['content-type'];
          const hasContentTypeMatched = acceptedFileTypes.some((contentTypeRegex) => contentType.match(contentTypeRegex));
          if (!hasContentTypeMatched) {
            req.abort();
            fs.unlink(path);
          } else {
            DbDao.create(DatabaseTypes.assets, {url: matchedValueElement, digest, path}, digest);
          }
        }).on('error', (err) => {
          console.log(err);
          req.abort();
        }).pipe(fs.createWriteStream(path));
      });
    }
  }

  private randomValueHex (len: number = 40) {
    return crypto.randomBytes(Math.ceil((len) / 2))
                 .toString('hex') // convert to hexadecimal format
                 .slice(0, len);   // return required number of characters
  }

  public authorize(req: Request, res: Response, next: NextFunction): void {
    const ticket = req.params.ticket;
    if (ticket) {
      cas.validate(ticket, function(err, status, username) {
        if (err) {
          // Handle the error
          res.send({error: err});
        } else {
          // Log the user in
          res.send({status: status, username: username});
        }
      });
    } else {
      const loginUrl = `${casSettings.base_url}?service=${req.headers.referer}/${this.randomValueHex(12)}`;
      res.redirect(loginUrl);
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  private init(): void {
    this._router.get('/', this.getAll);

    this._router.post('/mathjax', this.renderMathjax);
    this._router.get('/mathjax/example/first', this.getFirstMathjaxExample);
    this._router.get('/mathjax/example/second', this.getSecondMathjaxExample);
    this._router.get('/mathjax/example/third', this.getThirdMathjaxExample);

    this._router.post('/cache/quiz/assets', this.cacheQuizAssets.bind(this));

    this._router.get('/authorize', this.authorize.bind(this));
  }

}

// Create the LibRouter, and export its configured Express.Router
const libRoutes: LibRouter = new LibRouter();

export default libRoutes.router;
