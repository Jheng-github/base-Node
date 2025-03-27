const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });

    try {
        // 創建頁面
        const page = await browser.newPage();
        let authToken = null;
        let tokenCaptured = false;
        
        // 設置用戶代理
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // 監聽回應，從中提取 token
        page.on('response', async (res) => {
            const url = res.url();
            
            // 只監控登入 API 回應
            if (url.includes('/service/operator/auth/login')) {
                try {
                    const text = await res.text();
                    try {
                        const data = JSON.parse(text);
                        if (data && data.data && data.data.token) {
                            authToken = data.data.token;
                            tokenCaptured = true;
                        }
                    } catch (e) {}
                } catch (e) {}
            }
        });
        
        // 訪問登入頁面
        await page.goto('http://127.0.0.1:8088/login', { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 進行表單登入
        // 找到表單元素並填充
        const formFillResult = await page.evaluate(() => {
            // 查找用戶名/密碼輸入框
            const usernameInput = document.querySelector('input[type="text"], input[name="username"], input.username, input#username, input:not([type="password"])');
            const passwordInput = document.querySelector('input[type="password"], input[name="password"], input.password, input#password');
            const submitButton = document.querySelector('button[type="submit"], button.submit, input[type="submit"], .login-button, .submit-button, button.el-button');
            
            if (usernameInput && passwordInput) {
                // 填充表單
                usernameInput.value = 'admin';
                passwordInput.value = 'aaaa1234';
                
                // 觸發輸入事件
                const inputEvent = new Event('input', { bubbles: true });
                usernameInput.dispatchEvent(inputEvent);
                passwordInput.dispatchEvent(inputEvent);
                
                // 點擊提交按鈕
                if (submitButton) {
                    submitButton.click();
                    return { success: true };
                } else {
                    // 提交表單
                    const form = usernameInput.closest('form') || passwordInput.closest('form');
                    if (form) {
                        form.submit();
                        return { success: true };
                    }
                }
            }
            
            return { success: false };
        });
        
        // 如果表單提交失敗，嘗試使用 API 登入
        // if (!formFillResult.success) {
        //     console.log('表單登入失敗，使用 API 登入...');
            
        //     // 執行 API 登入
        //     await page.evaluate(async () => {
        //         try {
        //             await fetch('http://127.0.0.1:8088/service/operator/auth/login', {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'OriRes': 'true',
        //                     'X-Requested-With': 'XMLHttpRequest',
        //                     'x-backend': 'ocms-ap',
        //                     'x-backend-port': '8080',
        //                     'ocms-timezone': '+08:00'
        //                 },
        //                 body: JSON.stringify({
        //                     username: 'wadelee',
        //                     password: 'elvis790510',
        //                     verification: '',
        //                     secret: ''
        //                 })
        //             });
        //         } catch (error) {}
        //     });
        // }
        
        // 等待捕獲令牌
        let waitTime = 0;

        // 這裡有個重發機制，看需要有沒有
        while (!tokenCaptured && waitTime < 10000) {
            await new Promise(resolve => setTimeout(resolve, 500));
            waitTime += 500;
        }
        
        // 檢查是否成功獲取令牌
        if (!authToken) {
            return;
        }
        
        // 檢查當前 URL，看是否已經登入成功
        const currentUrl = page.url();
        let activePage = page;
        
        if (!currentUrl.includes('/login')) {
            console.log('登入成功！已跳轉到儀表板')
        } else {
            console.log('設置令牌並訪問儀表板...');
            
            // 設置令牌
            await page.evaluate((token) => {
                localStorage.setItem('token', token);
                localStorage.setItem('auth_token', token);
                sessionStorage.setItem('token', token);
                document.cookie = `token=${token}; path=/`;
                document.cookie = `auth_token=${token}; path=/`;
            }, authToken);
            
            // 訪問儀表板
            await page.evaluate(async (token) => {
                // 檢查登入狀態
                const checkResponse = await fetch('http://127.0.0.1:8088/service/operator/auth/checkLogin', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Requested-With': 'XMLHttpRequest',
                        'x-backend': 'ocms-ap',
                        'x-backend-port': '8080'
                    }
                });
                
                if (checkResponse.ok) {
                    window.location.href = 'http://127.0.0.1:8088/dashboard';
                }
            }, authToken);
            
            // 等待跳轉
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // 如果還在登入頁面，嘗試使用新頁面
            if (page.url().includes('/login')) {
                console.log('使用新頁面訪問儀表板...');
                
                // 創建新頁面
                const newPage = await browser.newPage();
                await newPage.setExtraHTTPHeaders({
                    'Authorization': `Bearer ${authToken}`
                });
                
                // 在新頁面中設置令牌
                await newPage.evaluateOnNewDocument((token) => {
                    localStorage.setItem('token', token);
                    localStorage.setItem('auth_token', token);
                    sessionStorage.setItem('token', token);
                    document.cookie = `token=${token}; path=/`;
                }, authToken);
                
                // 訪問儀表板
                await newPage.goto('http://127.0.0.1:8088/dashboard', { 
                    waitUntil: 'networkidle2' 
                });
                
                // 關閉原始頁面
                await page.close();
                activePage = newPage;
            }
        }
        
        // 等待頁面完全加載
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        
        // 尋找並點擊會員管理菜單 
        const findAndClickMemberMenu = async () => {
            try {
                // 先嘗試查找會員管理菜單項
                const menuFound = await activePage.evaluate(() => {
                    // 根據文本內容查找菜單項
                    const findElementByText = (text) => {
                        const elements = Array.from(document.querySelectorAll('*'));
                        return elements.find(el => el.textContent && el.textContent.trim() === text);
                    };
                    
                    // 尋找可能的菜單項標籤
                    const memberManagementMenu = findElementByText('會員管理') || 
                                             findElementByText('會員') ||
                                             findElementByText('用戶管理') ||
                                             findElementByText('會員維護');
                    
                    if (memberManagementMenu) {
                        memberManagementMenu.click();
                        return true;
                    }
                    return false;
                });
                
                if (!menuFound) {
                    // 嘗試直接訪問會員查詢頁面
                    await activePage.goto('http://127.0.0.1:8088/membermgnt/memberquery', { waitUntil: 'networkidle2' });
                }
                
                return true;
            } catch (error) {
                console.error('尋找會員管理菜單出錯:', error);
                return false;
            }
        };
        
        // 嘗試找到會員管理菜單
        await findAndClickMemberMenu();
        
        // 等待子菜單加載
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 尋找並點擊會員查詢子菜單
        const findAndClickMemberQueryMenu = async () => {
            try {
                // 等待頁面元素加載完成
                await new Promise(resolve => setTimeout(resolve, 3000));
            
                // 尋找並點擊子菜單「會員查詢」
                const clickSubMenu = await activePage.evaluate(() => {
                    // 查找已展開的子菜單中的會員查詢選項
                    const findSubMenuItem = (text) => {
                        // 查找展開的子菜單容器
                        const expandedSubmenus = document.querySelectorAll('.el-submenu.is-opened, .el-submenu.is-active');
                        
                        for (const submenu of expandedSubmenus) {
                            // 在已展開的子菜單中查找指定文本的菜單項
                            const menuItems = submenu.querySelectorAll('.el-menu-item');
                            for (const item of menuItems) {
                                if (item.textContent && item.textContent.includes(text)) {
                                    return item;
                                }
                            }
                        }
                        return null;
                    };
                    
                    const queryMenuItem = findSubMenuItem('會員查詢') || 
                                       findSubMenuItem('查詢會員') || 
                                       findSubMenuItem('用戶查詢');
                    
                    if (queryMenuItem) {
                        // 嘗試點擊
                        queryMenuItem.click();
                        
                        return {
                            success: true,
                            text: queryMenuItem.textContent.trim(),
                            tagName: queryMenuItem.tagName,
                            className: queryMenuItem.className
                        };
                    }
                    
                    // 如果找不到特定子菜單，返回所有可見的子菜單項
                    const expandedSubmenus = document.querySelectorAll('.el-submenu.is-opened, .el-submenu.is-active');
                    const subMenuItems = [];
                    
                    expandedSubmenus.forEach(submenu => {
                        const items = submenu.querySelectorAll('.el-menu-item');
                        items.forEach(item => {
                            subMenuItems.push(item.textContent.trim());
                        });
                    });
                    
                    return {
                        success: false,
                        availableSubMenus: subMenuItems
                    };
                });
                return true;
            } catch (error) {

                await activePage.screenshot({ path: 'menu-click-error.png' });
                
                // 出錯後嘗試直接訪問URL
                await activePage.goto('http://127.0.0.1:8088/membermgnt/memberquery', { waitUntil: 'networkidle2' });
                
                return false;
            }
        };
        
        // 嘗試找到會員查詢子菜單
        await findAndClickMemberQueryMenu();
        
        // 等待頁面加載
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        
        // 點擊查詢按鈕 - 基於截圖中的確切HTML結構
        const performMemberQuery = async () => {
            try {
                // 等待頁面完全加載
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                
                // 基於截圖中的具體結構查找按鈕
                const queryResult = await activePage.evaluate(() => {
                    // 1. 精確匹配截圖中的按鈕
                    const exactButton = document.querySelector('button[type="submit"].el-button.el-button--primary');
                    if (exactButton) {
                        exactButton.click();
                        return { success: true, method: '精確匹配', className: exactButton.className };
                    }
                    
                   
                    // 記錄所有按鈕的信息用於診斷
                    const allButtons = Array.from(document.querySelectorAll('button')).map(btn => ({
                        text: btn.textContent.trim(),
                        type: btn.type,
                        className: btn.className,
                        id: btn.id,
                        disabled: btn.disabled
                    }));
                    
                    return { 
                        success: false, 
                        message: '找不到查詢按鈕或表單',
                        allButtons: allButtons
                    };
                });
                 
                // 等待查詢結果加載
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // 截圖按鈕點擊後的狀態
                await activePage.screenshot({ path: 'after-query-click.png' });
                
                // 如果查詢失敗，嘗試直接使用 mouse.click() 點擊坐標
                if (!queryResult.success) {
                    
                    // 嘗試找到按鈕的坐標
                    const buttonCoordinates = await activePage.evaluate(() => {
                        // 嘗試找到按鈕元素
                        const button = document.querySelector('button[type="submit"].el-button--primary') || 
                                      document.querySelector('.el-button--primary') ||
                                      document.querySelector('button[type="submit"]');
                        
                        if (button) {
                            const rect = button.getBoundingClientRect();
                            return {
                                x: rect.left + rect.width / 2,
                                y: rect.top + rect.height / 2
                            };
                        }
                        
                        // 如果找不到按鈕，返回 null
                        return null;
                    });
                    
                    if (buttonCoordinates) {
                        console.log(`嘗試點擊坐標: x=${buttonCoordinates.x}, y=${buttonCoordinates.y}`);
                        await activePage.mouse.click(buttonCoordinates.x, buttonCoordinates.y);
                        
                        // 等待可能的查詢結果
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        await activePage.screenshot({ path: 'after-coordinate-click.png' });
                    }
                }
                
                return queryResult.success;
            } catch (error) {
                console.error('執行會員查詢出錯:', error);
                await activePage.screenshot({ path: 'query-error.png' });
                return false;
            }
        };
        
        // 執行會員查詢
        await performMemberQuery();
        
        // 等待查詢結果加載
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 保存查詢結果截圖
        await activePage.screenshot({ path: 'member-query-result.png', fullPage: true });
        
        // 腳本執行完成後，瀏覽器保持打開狀態
        
    } catch (error) {
        console.error('執行出錯:', error);
    }
})();