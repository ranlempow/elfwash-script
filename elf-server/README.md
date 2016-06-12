### 開發方式

打開專案目錄中的 dev-sh.cmd 腳本檔, 來進入開發環境.

首次使用前先執行初始化安裝.
```
dev init
```
這將會安裝node.js在專案資料夾中, 並且安裝npm以及bower的package.


可以參考網路上的提議標準來撰寫更新日誌
http://keepachangelog.com/zh-TW/


```
grunt deploy-github
[enter your github username]
[enter your github password]
```

上傳完成後, 就可以在 http://ranlempow.github.io/elfwash-script/run.html 看到最新的網頁
