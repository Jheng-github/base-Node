/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex('CronJob').insert({
    Name: 'crawler',
    CronTime: '5 * * * *', // 每5分鐘執行一次
    Status: 1,
    IsRunning: 0,
    JobCount: 0,
    Ext: {}
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
