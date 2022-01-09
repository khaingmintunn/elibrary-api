'use strict'

require('dotenv').config()

class EmailBody {
  static signup(params) {
    return `<h3 style="margin-botton: 30px;">Hi ${params.name}</h3>
    <p>We recieved a request to signup new account.<br><br>
    So, please click <a href="${process.env.CLIENT_URL}/signup-confirm/${params.token_id}">here</a> to complete your signup process.</p>`
  }

  static signupConfirm(params) {
    return `<h3 style="margin-botton: 30px;">Congulations ${params.name}</h3>
    <p>Your signup process successfully. <br><br>
    Please login <a href="${process.env.CLIENT_URL}/login">here</a> and let start.`
  }

  static forgetPassword(params) {
    return `<h3 style="margin-botton: 30px;">Hi ${params.name}</h3>
    <p>We recieved a request to reset password of your account.<br><br>
    So, please click <a href="${process.env.CLIENT_URL}/reset-password/${params.token_id}">here</a> to complete your process.</p>`
  }

  static resetPassword(params) {
    return `<h3 style="margin-botton: 30px;">Hi ${params.name}</h3>
    <p>Password reset successfully.<br><br>
    So, please login again with new password <a href="${process.env.CLIENT_URL}/login">here</a>.</p>`
  }

  static updateEmail(params) {
    return `<h3 style="margin-botton: 30px;">Hi ${params.name}</h3>
    <p>You request to change the email of your account.<br><br>
    Click <a href="${process.env.CLIENT_URL}/email-confirm//${params.token_id}">here</a> to complete this process.</p>`
  }

  static updateEmailConfirm(params) {
    return `<h3 style="margin-botton: 30px;">Hi ${params.name}</h3>
    <p>Email update successfully.<br><br>
    Please use this email to next login.</p>`
  }

  static updatePassword(params) {
    return `<h3 style="margin-botton: 30px;">Hi ${params.name}</h3>
    <p>You changed your password successfully at ${new Date()}.<br><br>
    Don't forget new password.</p>`
  }

  static suspend(params) {
    return `<h3 style="margin-botton: 30px;">Hi ${params.name}</h3>
    <p>We had recently suspended your account at ${new Date()}.<br><br>
    If you have any question, contact us.</p>`
  }

  static unsuspend(params) {
    return `<h3 style="margin-botton: 30px;">Hi ${params.name}</h3>
    <p>We had recently unsuspended your account at ${new Date()}.<br><br>
    Be enjoy.</p>`
  }
}

module.exports = EmailBody
