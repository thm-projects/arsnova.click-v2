import {Request, Response, Router} from 'express';
import * as fs from 'fs';
import * as path from 'path';

const privateServerConfig = require('../../settings.json');
privateServerConfig.public.limitActiveQuizzes = parseFloat(privateServerConfig.public.limitActiveQuizzes);
const publicServerConfig = privateServerConfig.public;

declare global {
  interface UploadRequest extends Request {
    busboy: any;
  }

  interface I18nResponse extends Response {
    __mf: any;
  }
}

export class ApiRouter {
  get router(): Router {
    return this._router;
  }

  private _router: Router;

  /**
   * Initialize the ApiRouter
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  public getAll(req: Request, res: Response): void {
    res.send({
      serverConfig: publicServerConfig
    });
  }

  public randomFile(dir: string): Promise<string> {
    return new Promise((resolve) => {
      fs.readdir(dir, (err, items) => {
        resolve(items[Math.floor(Math.random() * items.length)]);
      });
    });
  }

  public getFileByName(req: Request, res: Response): void {
    const pathToFiles: string = path.join(__dirname, `../../${req.params.directory}/${req.params.subdirectory}`);
    if (req.params.fileName.indexOf('Random') > -1) {
      this.randomFile(pathToFiles).then((file: string) => {
        res.send(fs.readFileSync(file));
      });
    } else {
      res.send(fs.readFileSync(`${pathToFiles}/${req.params.fileName}`));
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  private init(): void {
    this._router.get('/', this.getAll);

    this._router.get('/files/:directory/:subdirectory/:fileName', this.getFileByName);
  }

}

// Create the ApiRouter, and export its configured Express.Router
const apiRoutes: ApiRouter = new ApiRouter();

export default apiRoutes.router;
