class RecaptchaFailError extends Error {
  constructor() {
    let msg = 'AUTH.RECAPTCHA.FAILED';

    super(msg);

    this.status = 400;
    this.name = 'RecaptchaFailError';
  }
}

module.exports = RecaptchaFailError;
