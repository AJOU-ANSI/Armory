const obj = {};

module.exports = obj;

obj.checkSuperAdminTokenMw = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer')) {
    let tokenValue = authHeader.split(' ')[1];
    if (tokenValue) tokenValue = tokenValue.trim();

    if (tokenValue === config.superAdminToken) {
      return next();
    }
  }

  const err = new Error('어드민 권한이 없습니다.');
  err.status = 401;

  return next(err);
};
