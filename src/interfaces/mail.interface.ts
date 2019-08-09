import { SendMailOptions } from 'nodemailer';

interface IMailRequest extends SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export { IMailRequest }