import { Router, Request, Response, NextFunction } from "express";

import errorMiddleware from "../../helpers/middlewares/error-middleware";

class MailController {

  private router: Router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post('/mail/send', this.onSendMail);
  }

  private onSendMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.end();
    } catch (err) {
      console.error(err);
      errorMiddleware(err, req, res, next);
    }
  };
}

export default MailController;
