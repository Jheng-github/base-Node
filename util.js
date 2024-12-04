const _ = require("lodash");
const responseCode = require("./Constants/response");

/**
 * 驗證值是否為數字
 * @param {number} value - 要驗證的值
 * @param {string} name - 值的名稱，用於錯誤訊息
 * @throws {<{
 *   code: number,
 *   message: {
 *     field: string
 *   }
 * }>}
 * @returns {number|null}
 */
function validNumber(value, name) {
  if (
    (_.isArray(value) || _.isString(value) || _.isObject(value)) &&
    !_.isNumber(value)
  ) {
    throw {
      code: responseCode.HTTP_STATUS.BAD_REQUEST,
      message: {
        field: `${name} should be a number`,
      },
    };
  }
  return value;
}

/**
 * 驗證值是否為數字且非空值
 * @param {number} value - 要驗證的值
 * @param {string} name - 值的名稱，用於錯誤訊息
 * @throws {<{
 *   code: number,
 *   message: {
 *     field: string
 *   }
 * }>} 如果值不是數字，或缺少必填數值，則拋出錯誤對象
 * @returns {number} 如果驗證通過，返回原始數值
 */
function validRequireNumber(value, name) {
  if (!_.isNumber(value)) {
    if (_.isArray(value) || _.isString(value) || _.isObject(value)) {
      throw {
        code: responseCode.HTTP_STATUS.BAD_REQUEST,
        message: {
          field: `${name} should be a number`,
        },
      };
    } else {
      throw {
        code: responseCode.HTTP_STATUS.BAD_REQUEST,
        message: {
          field: `${name} is required`,
        },
      };
    }
  }
  return value;
}

module.exports = {
  validNumber,
  validRequireNumber,
};
