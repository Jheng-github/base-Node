// test Middleware 1
function logTimestamp(req, res, next) {
  console.log('Time:', new Date().toISOString());
  next();
}

// test Middleware 2
function secondMiddleware(req, res, next) {
  console.log('secondMiddleware');
  throw {
    code: 401,
    message: 'test'
  }
  next();
}

module.exports = {
  logTimestamp,
  secondMiddleware
};