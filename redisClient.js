const { createClient } = require('redis');

const redisClient = createClient();
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
  await redisClient.connect();
})();

/**
 * 設置 Redis 鍵的值，並設置過期時間和選項。
 *
 * @param {string} key - 鍵名。
 * @param {string} value - 鍵值。
 * @param {number} expiryInSeconds - 過期時間，單位是秒。
 * @param {Object} [option=null] - 選項，可以是 NX 或 XX。
 * @returns {Promise<string>} - 返回 Redis 的回應。
 *
 * EX：設置鍵的過期時間，單位是秒。
 * PX：設置鍵的過期時間，單位是毫秒。
 * NX：如果鍵不存在則設置（用於防止覆蓋）。
 * XX：如果鍵已存在則設置（用於覆蓋現有值）。
 * 不添加 NX 或 XX 預設會覆蓋。
 */
redisClient.set = async (key, value, expiryInSeconds, option = null) => {
  try {
    const args = [key, value, 'EX', expiryInSeconds.toString()];
    if (option) {
      if (option.NX) {
        args.push('NX');
      }
      if (option.XX) {
        args.push('XX');
      }
    }
    // ex: set key value EX 10 NX
    await redisClient.sendCommand(['SET', ...args]);
  } catch (err) {
    console.error('Redis SET Error:', err);
  }
};

module.exports = redisClient;