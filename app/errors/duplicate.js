const dupMap = {
  'email': 'EMAIL',
  'name': 'NAME'
};

const getMessageFromError = (error) => {
  let errmsg = error.message;

  Object.keys(dupMap).forEach((key) => {
    if( error.message.indexOf(key) !== -1 ) {
      errmsg = `SIGNUP.${dupMap[key]}.DUPLICATED`;
    }
  });

  return errmsg;
};

class DuplicateKeyError extends Error {
  constructor(error) {
    super(getMessageFromError(error));

    this.status = 400;
    this.name = 'DuplicateKeyError';
  }
}

module.exports = DuplicateKeyError;
