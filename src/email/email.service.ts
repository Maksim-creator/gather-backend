import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationCode(email: string, code: string) {
    const mailOptions = {
      from: 'gather.enterprise.co@gmail.com',
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
