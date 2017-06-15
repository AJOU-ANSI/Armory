class UnauthorizedError extends Error {
  constructor(message) {
    super(message);

    this.status = 401;
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
