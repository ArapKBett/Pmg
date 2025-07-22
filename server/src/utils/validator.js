// server/src/utils/validator.js
const { validationResult } = require('express-validator');
const createError = require('http-errors');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const errorMessages = errors.array().map(err => err.msg);
    next(createError(400, errorMessages.join(', ')));
  };
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next(createError(401, 'Authentication required'));

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    next(createError(403, 'Invalid or expired token'));
  }
};

const authenticateWS = (ws, req, next) => {
  const token = req.url.split('token=')[1];
  
  if (!token) {
    ws.close(1008, 'Authentication required');
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    ws.close(1008, 'Invalid token');
  }
};

module.exports = {
  validate,
  authenticate,
  authenticateWS
};
