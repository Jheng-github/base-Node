const responseCode = require("../Constants/response");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

describe("validNumber", () => {
  const util = require("../util");
  it("輸入數字 ok", () => {
    const value = 42;
    const name = "testNumber";
    const result = util.validNumber(value, name);
    expect(result).to.equal(value);
  });

  it("輸入null ok", () => {
    const value = null;
    const name = "testNumber";
    const result = util.validNumber(value, name);
    expect(result).to.be.null;
  });

  it("輸入陣列 error", async () => {
    const value = [1, 2, 3];
    const name = "testArray";
    expect(() => util.validNumber(value, name))
      .to.throw()
      .that.deep.equal({
        code: 400,
        message: {
          field: "testArray should be a number",
        },
      });
  });

  it("輸入字串 error", () => {
    const value = "test";
    const name = "testString";
    expect(() => util.validNumber(value, name))
      .to.throw()
      .that.deep.equals({
        code: 400,
        message: { field: `${name} should be a number` },
      });
  });

  it("輸入物件 error", () => {
    const value = { test: 123 };
    const name = "testObject";
    expect(() => util.validNumber(value, name))
      .to.throw()
      .that.deep.equals({
        code: 400,
        message: { field: `${name} should be a number` },
      });
  });
});

describe("validRequireNumber", () => {
  const util = require("../util");
  it("輸入數字 ok", () => {
    const value = 42;
    const name = "testNumber";
    expect(util.validRequireNumber(value, name)).to.equal(value);
  });

  it("輸入陣列 error", () => {
    const value = [1, 2, 3];
    const name = "testArray";
    expect(() => util.validRequireNumber(value, name))
      .to.throw()
      .that.deep.equals({
        code: 400,
        message: { field: `${name} should be a number` },
      });
  });

  it("輸入字串 error", () => {
    const value = "42";
    const name = "testString";
    expect(() => util.validRequireNumber(value, name))
      .to.throw()
      .that.deep.equals({
        code: 400,
        message: { field: `${name} should be a number` },
      });
  });

  it("輸入物件 error", () => {
    const value = { test: 123 };
    const name = "testObject";
    expect(() => util.validRequireNumber(value, name))
      .to.throw()
      .that.deep.equals({
        code: 400,
        message: { field: `${name} should be a number` },
      });
  });

  it("輸入null error", () => {
    const value = null;
    const name = "testNull";
    expect(() => util.validRequireNumber(value, name))
      .to.throw()
      .that.deep.equals({
        code: 400,
        message: { field: `${name} is required` },
      });
  });

  it("undefined error", () => {
    const value = undefined;
    const name = "testNaN";
    expect(() => util.validRequireNumber(value, name))
      .to.throw()
      .that.deep.equals({
        code: 400,
        message: { field: `${name} is required` },
      });
  });
});
