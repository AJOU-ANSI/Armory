class UnauthorizedError extends Error {
  constructor() {
    super('AUTH.UNAUTHENTICATED');

    this.status = 401;
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
