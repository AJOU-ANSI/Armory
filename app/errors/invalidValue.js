const invalidMap = {
  'email': 'EMAIL',
  'password': 'PWD'
};

const getMessageFromError = (error) => {
  let msg = '';

  let exists = Object.keys(invalidMap).some(value => {
    if( error.errors[value] ) {
      msg = `SIGNUP.${invalidMap[value]}.INVALID`;

      return true;
    }
  });

  if (!exists) {
    msg = 'UNKNOWN';
  }

  return msg;
}

class InvalidValueError extends Error {
  constructor(error) {
    super(getMessageFromError(error));

    this.status = 400;
    this.name = 'InvalidValueError';
  }
}

module.exports = InvalidValueError;
