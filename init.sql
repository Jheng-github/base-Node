-- 目前還沒想到要如何把這裡的密碼設定成環境變數
-- mysql 在新版會用caching_sha2_password當作身份驗證方法，要用密碼登入的話要改成mysql_native_password
-- 讓容器啟動時自動執行
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '1234';
FLUSH PRIVILEGES;
