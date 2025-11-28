# 叫料系統 (Material Request System)

一個功能完整的ERP叫料管理系統，支援手機和電腦端使用，具備Excel匯入匯出、雲端儲存、郵件和LINE通知功能。

## 功能特色

### 1. 使用者認證
- ✅ 帳號密碼登入
- ✅ Google OAuth 登入
- ✅ Apple 登入（開發中）
- ✅ 試用帳號功能

### 2. 材料管理
- ✅ 施工類別管理
- ✅ 材料類別管理
- ✅ 材料資料庫管理
- ✅ Excel檔案匯入功能
- ✅ 自動分類整理

### 3. 叫料功能
- ✅ 建立叫料單
- ✅ 自動產生Excel檔案
- ✅ 上傳至Google雲端硬碟
- ✅ 自動發送郵件通知
- ✅ LINE Notify通知
- ✅ 叫料單歷史記錄

### 4. 響應式設計
- ✅ 手機適配
- ✅ 平板適配
- ✅ 電腦端完整功能

## 技術棧

### 後端
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT認證
- Passport.js (OAuth)
- XLSX (Excel處理)
- Nodemailer (郵件)
- Google Drive API (雲端儲存)
- LINE Notify API

### 前端
- React 18
- TypeScript
- React Router
- TanStack Query
- Tailwind CSS
- Vite

## 專案結構

```
叫料系統/
├── server/                 # 後端API
│   ├── src/
│   │   ├── db/            # 資料庫連接和遷移
│   │   ├── middleware/    # 中介軟體
│   │   ├── routes/        # API路由
│   │   ├── services/      # 業務邏輯服務
│   │   └── index.ts       # 入口檔案
│   └── package.json
├── client/                 # 前端應用
│   ├── src/
│   │   ├── components/    # React組件
│   │   ├── contexts/      # Context API
│   │   ├── pages/         # 頁面組件
│   │   └── utils/         # 工具函數
│   └── package.json
├── render.yaml            # Render部署配置
└── README.md
```

## 安裝與設定

### 前置需求
- Node.js 18+
- PostgreSQL 12+
- npm 或 yarn

### 1. 安裝依賴

```bash
# 安裝所有依賴
npm run install:all

# 或分別安裝
npm install
cd server && npm install
cd ../client && npm install
```

### 2. 資料庫設定

建立PostgreSQL資料庫：

```sql
CREATE DATABASE material_request_db;
```

### 3. 環境變數設定

複製 `.env.example` 並設定環境變數：

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入以下資訊：

#### 必要設定
- `DATABASE_URL`: PostgreSQL連接字串
- `JWT_SECRET`: JWT密鑰（生產環境請使用強密鑰）
- `PORT`: 伺服器端口（預設5000）

#### OAuth設定（選填）
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `GOOGLE_REDIRECT_URI`: Google OAuth回調URL

#### 郵件設定（選填）
- `SMTP_HOST`: SMTP伺服器地址
- `SMTP_PORT`: SMTP端口
- `SMTP_USER`: SMTP使用者名稱
- `SMTP_PASS`: SMTP密碼
- `SMTP_FROM`: 發件人郵箱

#### LINE通知設定（選填）
- `LINE_NOTIFY_CLIENT_ID`: LINE Notify Client ID
- `LINE_NOTIFY_CLIENT_SECRET`: LINE Notify Client Secret

#### Google Drive設定（選填）
- `GOOGLE_DRIVE_CLIENT_ID`: Google Drive API Client ID
- `GOOGLE_DRIVE_CLIENT_SECRET`: Google Drive API Client Secret
- `GOOGLE_DRIVE_REFRESH_TOKEN`: Google Drive刷新令牌

#### 試用帳號設定
- `TRIAL_EMAIL`: 試用帳號郵箱
- `TRIAL_PASSWORD`: 試用帳號密碼

### 4. 執行開發伺服器

```bash
# 同時啟動前端和後端
npm run dev

# 或分別啟動
npm run dev:server  # 後端 (http://localhost:5000)
npm run dev:client  # 前端 (http://localhost:3000)
```

## 使用說明

### 試用帳號登入

系統預設提供試用帳號功能，可使用 `.env` 中設定的試用帳號登入。

### Excel匯入格式

匯入材料時，Excel檔案應包含以下欄位：

| 施工類別 | 材料類別 | 材料名稱 | 單位（選填） |
|---------|---------|---------|------------|
| 基礎工程 | 水泥 | 普通水泥 | 包 |
| 基礎工程 | 砂石 | 細砂 | 立方公尺 |

### 叫料流程

1. 登入系統
2. 進入「新增叫料」頁面
3. 選擇施工類別
4. 選擇並新增所需材料
5. 填入數量和備註
6. 提交叫料單
7. 系統自動：
   - 產生Excel檔案
   - 上傳至雲端（如已設定）
   - 發送郵件通知（如已設定）
   - 發送LINE通知（如已設定）

## 部署到Render

### 1. 準備GitHub儲存庫

將程式碼推送到GitHub：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. 在Render建立服務

1. 登入 [Render](https://render.com)
2. 點選「New +」→「Web Service」
3. 連接GitHub儲存庫
4. 設定以下參數：
   - **Name**: material-request-system
   - **Environment**: Node
   - **Build Command**: `npm install:all && npm run build`
   - **Start Command**: `cd server && npm start`

### 3. 設定環境變數

在Render Dashboard中，進入「Environment」頁籤，新增所有必要的環境變數。

### 4. 設定資料庫

在Render建立PostgreSQL資料庫：
1. 點選「New +」→「PostgreSQL」
2. 記錄資料庫連接字串
3. 更新環境變數中的 `DATABASE_URL`

### 5. 設定前端URL

更新環境變數 `FRONTEND_URL` 為您的Render應用URL。

## Google OAuth設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 建立新專案
3. 啟用Google+ API
4. 建立OAuth 2.0憑證
5. 設定授權重新導向URI：
   - 開發環境：`http://localhost:5000/api/auth/google/callback`
   - 生產環境：`https://your-domain.com/api/auth/google/callback`
6. 將Client ID和Secret填入環境變數

## LINE Notify設定

1. 前往 [LINE Notify](https://notify-bot.line.me)
2. 登入並建立服務
3. 取得Client ID和Secret
4. 設定回調URL
5. 使用者可透過系統連動LINE帳號

## Google Drive API設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com)
2. 啟用Google Drive API
3. 建立OAuth 2.0憑證（或使用服務帳號）
4. 取得Refresh Token
5. 將憑證填入環境變數

## 開發建議

### 資料庫遷移

首次執行時，系統會自動建立所需的資料表。如需手動執行：

```bash
cd server
npm run migrate
```

### 測試

```bash
# 測試後端
cd server
npm test

# 測試前端
cd client
npm test
```

## 問題排除

### 資料庫連接失敗
- 確認 `DATABASE_URL` 設定正確
- 確認PostgreSQL服務正在運行
- 檢查防火牆設定

### OAuth登入失敗
- 確認回調URL設定正確
- 檢查Client ID和Secret
- 查看伺服器日誌

### Excel匯入失敗
- 確認檔案格式正確
- 檢查欄位名稱是否匹配
- 查看伺服器錯誤日誌

## 授權

MIT License

## 聯絡方式

如有問題或建議，請建立Issue或Pull Request。

