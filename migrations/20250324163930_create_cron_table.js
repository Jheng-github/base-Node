// migrations/20250324163930_create_cron_table.js

exports.up = function(knex) {
  return knex.schema.createTable('CronJob', function(table) {
      table.string('Name', 50).notNullable().primary();
      table.string('CronTime', 50).notNullable().defaultTo('')
          .comment('Cron Time Pattern');
      
      table.tinyint('IsRunning').notNullable().defaultTo(0)
          .comment('0: 未執行, 1:執行中');
      
      table.tinyint('Status').notNullable().defaultTo(1)
          .comment('0: 停用, 1: 啟用');
      
      // 修正 UpdateTime 欄位定義
      table.timestamp('UpdateTime')
          .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
          .comment('最後修改時間');
          
      table.integer('JobCount').notNullable().defaultTo(0)
          .comment('執行次數');
      
      table.timestamp('StartTime')
          .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
          .comment('開始時間');
      
      table.timestamp('FinishTime')
          .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
          .comment('結束時間');
      
      table.json('Ext')
          .nullable()
          .comment('其他資訊');
      
      // 添加索引
      table.index('UpdateTime', 'IDX_UpdateTime');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('CronJob');
};