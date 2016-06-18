# Logging

## 記錄的等級

由微小到重大分為以下幾級

### logging.**TRACE**
提供執行上最多細節的資訊

### logging.**DEBUG**
可供除錯的詳細資訊

### logging.**INFO**
一般的概要性資訊, 這是最普通的等級

### logging.**WRAN**
值得注意而且可能造成傷害的的事件

### logging.**ERROR**
執行時遭遇到錯誤.

### logging.**FATAL**
執行時遭遇到不可恢復的嚴重錯誤.


## 基本API

tag通常代表事件發生地點或是所屬的分類. 超過一個以上的tag可以用'.'來分隔
message可以是字串或是任意物件
time代表發生的遊戲時間, 可以不指定.

logging(level, tag, message[, time])
logging.**trace**(tag, message[, time])
logging.**debug**(tag, message[, time])
logging.**info**(tag, message[, time])
logging.**warn**(tag, message[, time])
logging.**error**(tag, message[, time])
logging.**fatal**(tag, message[, time])

## 已經決定好Tag的紀錄器

### logging.**getLogger**(tag)
#### tag
Type: String

建立起綁定特定tag的紀錄器並返回新建立的紀錄器.
這個記錄器與logging有著一樣的介面, 除了不用指定tag參數以外, 剩下完全一模一樣.

### Logger(level, message[, time])
### Logger.**trace**(message[, time])
### Logger.**debug**(message[, time])
### Logger.**info**(message[, time])
### Logger.**warn**(message[, time])
### Logger.**error**(message[, time])
### Logger.**fatal**(message[, time])

範例
```javascript
var logging = logging.getLogger('mypkg.mytag');
logging.info('hello');
```
