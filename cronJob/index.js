const schedule = require('node-schedule');
const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV || 'development']);
const crawler = require('./crawler');

// 儲存所有活動中的排程任務
const activeJobs = {};

// 簡單的測試函數 - 可替換為您的實際爬蟲函數
async function runJob(jobName) {
    console.log(`執行任務 ${jobName} - ${new Date().toLocaleString()}`);
    try {
        switch (jobName) {
          case 'crawler':
            await console.log('123123')
            break;
        //   case 'jdbDemoRegisterMoney':
        //     await cron.callAp(`cron/others/jdbDemoRegisterMoney?${args}`);
        //     break;
        }
    } catch (error) {
        console.error(`執行任務 ${jobName} 時發生錯誤:`, error);
    }
    // 這裡可以替換為您的爬蟲邏輯或其他任務
}

// 更新任務狀態
async function updateJobStatus(name, isRunning, shouldIncreaseCount = false) {
    try {
        const updateData = { IsRunning: isRunning, UpdateTime: knex.fn.now() };
        
        if (isRunning) {
            // 更新開始時間
            updateData.StartTime = knex.fn.now();
        } else {
            // 更新結束時間
            updateData.FinishTime = knex.fn.now();
        }
        
        if (shouldIncreaseCount) {
            // 增加執行次數
            await knex.raw(`UPDATE CronJob SET JobCount = JobCount + 1 WHERE Name = ?`, [name]);
        }
        
        await knex('CronJob').where('Name', name).update(updateData);
    } catch (error) {
        console.error(`更新任務狀態失敗 (${name}):`, error);
    }
}

// 執行任務的包裝函數
async function executeJob(jobName) {
    try {
        // 開始執行前檢查任務是否啟用
        const job = await knex('CronJob').where({ Name: jobName, Status: 1 }).first();
        if (!job) {
            console.log(`任務 ${jobName} 未啟用或不存在，跳過執行`);
            return;
        }

        // 更新狀態為執行中
        await updateJobStatus(jobName, 1);
        console.log(`開始執行任務 ${jobName}`);

        // 執行實際任務
        runJob(jobName);

        // 增加執行次數並更新狀態為完成
        await updateJobStatus(jobName, 0, true);
        console.log(`任務 ${jobName} 執行完成`);

    } catch (error) {
        console.error(`執行任務 ${jobName} 時發生錯誤:`, error);
        
        // 發生錯誤時，仍需要更新狀態
        try {
            await updateJobStatus(jobName, 0, true);
        } catch (updateError) {
            console.error(`更新任務狀態失敗:`, updateError);
        }
    }
}

// 從資料庫讀取排程設定並設定排程任務
async function setupScheduleFromDB() {
    try {

        // 清除之前可能的執行中狀態
        await knex('CronJob').update({ IsRunning: 0 });
        
        // 獲取所有啟用的任務
        const scheduledJobs = await knex('CronJob').where('Status', 1).select('*');
        
        if (scheduledJobs.length === 0) {
            console.log('沒有找到啟用的排程任務');
            return {};
        }
        // 為每個任務設定排程
        scheduledJobs.forEach(job => {
            console.log(`設定任務: ${job.Name}, 排程: ${job.CronTime}`);
            
            // 使用 node-schedule 設定排程
            activeJobs[job.Name] = schedule.scheduleJob(job.CronTime, function() {
                // 當排程觸發時執行任務
                executeJob(job.Name);
            });
        });
        
        console.log('所有排程任務設定完成');
        
        // 回傳所有活動中的任務，以便後續管理
        return activeJobs;
        
    } catch (error) {
        console.error('設定排程任務時發生錯誤:', error);
        return {};
    }
}

// 添加立即執行特定任務的功能
async function runJobNow(jobName) {
    try {
        // 檢查任務是否存在且啟用
        const job = await knex('CronJob').where({ Name: jobName, Status: 1 }).first();
        
        if (!job) {
            console.log(`任務 ${jobName} 不存在或未啟用`);
            return false;
        }
        
        console.log(`立即執行任務 ${jobName}`);
        await executeJob(jobName);
        return true;
    } catch (error) {
        console.error(`立即執行任務 ${jobName} 失敗:`, error);
        return false;
    }
}

// 列出所有任務狀態
async function listAllJobs() {
    try {
        const jobs = await knex('CronJob').select('*');
        
        console.log('\n現有排程任務:');
        jobs.forEach(job => {
            const status = job.Status ? '啟用' : '停用';
            const running = job.IsRunning ? '執行中' : '閒置';
            
            console.log(`- ${job.Name}: ${status}, 排程: ${job.CronTime}, 執行次數: ${job.JobCount}, 狀態: ${running}`);
        });
        console.log('');
        
    } catch (error) {
        console.error('獲取任務列表失敗:', error);
    }
}

// 主程式
async function main() {
    try {
        // 先確認資料庫連線
        await knex.raw('SELECT 1');
        console.log('資料庫連線成功');
        
        // 設定排程任務
        const jobs = await setupScheduleFromDB();
        
        
        // 處理用戶輸入的命令
        process.stdin.on('data', async (data) => {
            const input = data.toString().trim();
            const [command, ...args] = input.split(' ');
            
            switch (command.toLowerCase()) {
                case 'run':
                    if (args.length > 0) {
                        await runJobNow(args[0]);
                    } else {
                        console.log('請指定要執行的任務名稱，例如: run TestCrawler');
                    }
                    break;
                    
                case 'list':
                    await listAllJobs();
                    break;
                    
                case 'reload':
                    console.log('重新載入所有排程任務...');
                    // 取消所有現有排程
                    Object.values(jobs).forEach(job => job.cancel());
                    // 重新設定排程
                    await setupScheduleFromDB();
                    console.log('排程任務已重新載入');
                    break;
                    
                case 'exit':
                    console.log('正在停止所有排程任務...');
                    Object.values(jobs).forEach(job => job.cancel());
                    
                    // 更新所有任務狀態為未執行
                    await knex('CronJob').where('IsRunning', 1).update('IsRunning', 0);
                    
                    // 關閉資料庫連線
                    await knex.destroy();
                    
                    console.log('程式已正常退出');
                    process.exit(0);
                    break;
                    
                default:
                    console.log('無效的命令。可用命令: run, list, reload, exit');
            }
        });
        
        // 處理程式終止
        process.on('SIGINT', async () => {
            console.log('\n接收到中斷信號，正在停止所有排程任務...');
            
            // 取消所有排程
            Object.values(jobs).forEach(job => job.cancel());
            
            // 更新資料庫中的任務狀態
            await knex('CronJob').where('IsRunning', 1).update('IsRunning', 0);
            
            // 關閉資料庫連線
            await knex.destroy();
            
            console.log('所有排程任務已停止，程式退出');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('初始化失敗:', error);
        
        if (knex) {
            await knex.destroy();
        }
        
        process.exit(1);
    }
}

// 執行主程式
main().catch(console.error);