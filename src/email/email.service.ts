import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import * as smtpTransport from 'nodemailer-smtp-transport';
// const smtpTransport = require('nodemailer-smtp-transport');

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      auth: {
        user: 'reekolect.m@gmail.com',
        pass: 'uebr cyzy pyjc rcop',
      },
    });
  }

  async sendVerificationCode(email: string, code: string) {
    const mailOptions = {
      from: process.env.EMAIL_LOGIN,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
