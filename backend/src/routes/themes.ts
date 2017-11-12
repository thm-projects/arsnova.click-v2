import {Router, Request, Response, NextFunction} from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {themes} from '../themes/availableThemes';

export class ThemesRouter {
  get router(): Router {
    return this._router;
  }

  private _router: Router;

  /**
   * Initialize the ThemesRouter
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  public getThemes(req: Request, res: Response): void {
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'GET_THEMES',
      payload: themes
    });
  }

  public getTheme(req: Request, res: Response): void {
    res.send(fs.readFileSync(path.join(__dirname, `../../images/themes/${req.params.themeId}_${req.params.languageId}.png`)));
  }

  public init(): void {
    this._router.get('/', this.getThemes);
    this._router.get('/:themeId/:languageId', this.getTheme);
  }
}

// Create the ApiRouter, and export its configured Express.Router
const themesRoutes: ThemesRouter = new ThemesRouter();

export default themesRoutes.router;
