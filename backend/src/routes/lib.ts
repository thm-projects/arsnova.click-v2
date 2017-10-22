import {NextFunction, Request, Response, Router} from 'express';
import * as mjAPI from 'mathjax-node';

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
      displayErrors:   true,
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
          inlineMath: [ ['$', '$'], ['\\(', '\\)'] ],
          displayMath: [ ['$$', '$$'], ['\\[', '\\]'] ],
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
        mjAPI.typeset({
          math: mathjaxPlain.replace(/ ?\${1,2} ?/g, ''),
          format: req.body.format,
          html: req.body.output === 'html',
          css: req.body.output === 'html',
          svg: req.body.output === 'svg',
          mml: req.body.output === 'mml'
        }).then(data => {
          result.push(data);
          if (index === mathjaxArray.length - 1) {
            res.send(JSON.stringify(result));
          }
        });
      });
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
  }

}

// Create the LibRouter, and export its configured Express.Router
const libRoutes: LibRouter = new LibRouter();

export default libRoutes.router;
