const nodemailer = require('nodemailer')

class Email {
  /**
   * Send Message To Email Address
   * @param {Object} params
   */
  static async send(params) {
    if (!params.email || params.email === undefined) return 0

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    return await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: params.email,
      subject: params.subject,
      text: params.text,
      html: params.html,
    })
  }
}

module.exports = Email
