function example(req, res, next) {
  console.log('example');
  next();
}

module.exports = {
  example,
};