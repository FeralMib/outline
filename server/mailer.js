// @flow
import React from 'react';
import nodemailer from 'nodemailer';
import Oy from 'oy-vey';
import invariant from 'invariant';
import { baseStyles } from './emails/components/EmailLayout';

import { WelcomeEmail, welcomeEmailText } from './emails/WelcomeEmail';

type SendMailType = {
  to: string,
  properties?: any,
  title: string,
  previewText?: string,
  text: string,
  html: React.Element<*>,
  headCSS?: string,
};

/**
 * Mailer
 *
 * Mailer class to contruct and send emails.
 *
 * To preview emails, add a new preview to `emails/index.js` and visit following
 * URLs in development mode:
 *
 * HTML: http://localhost:3000/email/:email_type/html
 * TEXT: http://localhost:3000/email/:email_type/text
 */
class Mailer {
  transporter: ?any;

  /**
   *
   */
  sendMail = async (data: SendMailType): ?Promise<*> => {
    if (this.transporter) {
      const html = Oy.renderTemplate(data.html, {
        title: data.title,
        headCSS: [baseStyles, data.headCSS].join(' '),
        previewText: data.previewText,
      });

      invariant(this.transporter, 'very sure this.transporter exists');
      try {
        await this.transporter.sendMail({
          from: process.env.SMTP_SENDER_EMAIL,
          to: data.to,
          subject: data.title,
          html: html,
          text: data.text,
        });
      } catch (e) {
        Bugsnag.notifyException(e);
      }
    }
  };

  welcome = async (to: string) => {
    this.sendMail({
      to,
      title: 'Welcome to Outline',
      previewText:
        'Outline is a place for your team to build and share knowledge.',
      html: <WelcomeEmail />,
      text: welcomeEmailText,
    });
  };

  constructor() {
    if (process.env.SMTP_HOST) {
      let smtpConfig = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      };

      this.transporter = nodemailer.createTransport(smtpConfig);
    }
  }
}

const mailer = new Mailer();

export { Mailer };
export default mailer;
