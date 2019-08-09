import { Router, Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';

import errorMiddleware from '../../helpers/middlewares/error-middleware';
import { IMailRequest } from '../../interfaces/mail.interface';

import { DEBUG, emailConfig } from './../../config';

class MailController {

  private router: Router = Router();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.post('/mail/send', this.onSendMail);
  }

  private onSendMail = async (req: Request, res: Response, next: NextFunction) => {
    let transporter;
    try {
      const data = <IMailRequest>req.body;
      // TODO: Need to define host, user and pass for real environment...
      let host = emailConfig.host;
      let port = emailConfig.port;
      let from = emailConfig.email;
      let username = emailConfig.email;
      let password = emailConfig.password;
      let tls = emailConfig.tls;
      if (DEBUG) {
        const testAccount = await nodemailer.createTestAccount();
        host = testAccount.smtp.host;
        port = testAccount.smtp.port;
        from = 'example@nodemailer.com';
        username = testAccount.user;
        password = testAccount.pass;
        tls = false;
      }
      transporter = nodemailer.createTransport({
        logger: DEBUG,
        host: host,
        port: port,
        secure: false,
        auth: {
          user: username,
          pass: password
        },
        tls: {
          rejectUnauthorized: tls,
        }
      });
      const info = await transporter.sendMail({ ...data, from });
      console.info('Message sent: %s', info.messageId);
      if (DEBUG)
        console.warn('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.end();
    } catch (err) {
      console.error(err);
      errorMiddleware(err, req, res, next);
    } finally {
      if (transporter)
        transporter.close();
    }
  };
}

export default MailController;
