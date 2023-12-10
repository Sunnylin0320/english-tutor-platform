# english-tutor-platform
## 專案介紹
此專案為此為一個簡易的英文家教平台，可進行預約課程、評論課程等功能，使用 Node.js 並搭配 express.js框架做開發，並使用MySQL資料庫。


## 功能

### 前台（使用者）
- 註冊及登入功能
- 編輯自己的頁面
- 瀏覽個人頁面，且頁面顯示課程提醒
- 瀏覽全站所有課程
- 瀏覽單筆課程並進行預約
- 學生可針對已完成的課程預定做評論、評分


### 後台（管理者）
- 登入功能
- 瀏覽全部使用者列表及其角色


## 測試 / 種子帳號
| Role     | Account   | Password |
| :-------:| :-------: | :------: |
| 前台使用者 | user1     | 12345678 |
| 後台管理者 | root      | 12345678 |


## 安裝及使用

### 環境建置
確認本地端已下載
 - node.js
 - MYSQL
 - workbench

### 開始使用
1. 打開終端機(Terminal)，Clone 此專案至本機電腦
  ```
  $ git clone https://github.com/Sunnylin0320/english-tutor-platform
  ```

2. 進入此專案資料夾
  ```
  $ cd english-tutor-platform
  ```

3. 安裝本專案相依套件 
  ```
  $ npm install
  ```

4. 參考 `.env.example` 建立 `.env` 文件，並設置您的環境變數


5. 於 `config/config.json` 文件中設定您資料庫的相關訊息

6. 建立資料表
  ```
  $ npx sequelize db:migrate
  ```

7. 建立種子資料
  ```
  $ npx sequelize db:seed:all
  ```

8. 輸入以下指令，啟動本專案
  ```
  $ npm run dev
  ```
