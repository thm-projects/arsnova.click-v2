import {Router, Request, Response, NextFunction} from 'express';
import availableNicks from '../nicknames/availableNicks';
import illegalNicks from '../nicknames/illegalNicks';

export class NicksRouter {
  get router(): Router {
    return this._router;
  }

  private _router: Router;

  /**
   * Initialize the NicksRouter
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  private getAll(req: Request, res: Response, next: NextFunction): void {
    res.json({});
  }

  public getAllAvailableNicks(req: Request, res: Response): void {
    res.send(availableNicks);
  }

  public getAllBlockedNicks(req: Request, res: Response): void {
    res.send(illegalNicks);
  }

  public init(): void {
    this._router.get('/', this.getAll);

    this._router.get('/predefined', this.getAllAvailableNicks);
    this._router.get('/blocked', this.getAllBlockedNicks);
  }
}

// Create the ApiRouter, and export its configured Express.Router
const nicksRoutes: NicksRouter = new NicksRouter();

export default nicksRoutes.router;
