// TODO: hidden-bar .set()
// TODO: hidden-bar package="" then remove
// TODO: hidden-bar group=divder+header, add_to_group
// TODO: hidden-bar bar-icon
// TODO: 中文化: 錯誤訊息, 型別名稱
// TODO: cmds快速鍵
// TODO: hidden-bar lazy
// TODO: 解說用UI
// TODO: hidden-bar 好用功能: list, chackbox

## 進度規劃

這幾個是最重要的

1. 第一版機制
2. Model功能
3. 事件顯示器
4. 資料庫載入
5. 資料庫編輯
6. 資料庫存讀檔



### 企劃設定

利用**遊戲製作平台**進行遊戲設計實驗與驗證,
嘗試各種機制和調整數値來讓遊戲變得更好玩.

- 第一版機制
- 妖精的個人故事
- 各類物件的英文命名
- 商店
- 社群
- 調整再調整


### 遊戲製作平台(Web)

- 事件顯示器 :    有捲軸的清單, 每發生新事件就會再底部加一個新條目
- 快照 :    對進行中的遊戲存檔與讀檔, 並且考慮不同版本的處理
- 資料庫編輯  
- 資料庫存讀檔  
- 顯示圖片 :    將遊戲中的靜態圖片放入網頁中, 能企劃人員更能夠體會遊戲帶給人的感覺
- 簡易對畫框 :    如果有決定要做AVG模式...


### 遊戲邏輯系統(javascript)

- LuaAPI :    提供給Lua的API, 要稍微考慮這些功能會不會太難在手機實現
- 資料庫載入 :    從某處讀取資料庫轉換進入Lua
- 伺服器通訊 :    利用Restful與伺服器溝通


### 遊戲邏輯腳本(lua)

- Model功能 :   詳情請看docs/model.md


### 伺服器

- 登入服務
- IAP服務
- 存檔服務
- 社群服務
- 更新服務

