function example(opts) {
  const example = {};
  example.number = opts
  return example;
}

function getList(opts) {
  const getList = {};
  getList.number = opts
  return getList;
}

module.exports = {
  example,
  getList,
};
