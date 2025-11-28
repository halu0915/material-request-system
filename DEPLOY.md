# 部署指南

## 部署到 Render 的步驟

### 1. 準備 GitHub 儲存庫

```bash
# 初始化 Git
git init

# 添加所有檔案
git add .

# 建立初始提交
git commit -m "Initial commit: 叫料系統"

# 在 GitHub 建立新儲存庫，然後連接
git remote add origin <您的GitHub儲存庫URL>

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 2. 在 Render 建立 PostgreSQL 資料庫

1. 登入 [Render Dashboard](https://dashboard.render.com)
2. 點選「New +」→「PostgreSQL」
3. 設定：
   - **Name**: material-request-db
   - **Database**: material_request_db
   - **User**: 使用預設或自訂
   - **Region**: 選擇靠近您的區域
   - **Plan**: Free（開發環境）或 Starter（生產環境）
4. 點選「Create Database」
5. 等待建立完成後，複製「Internal Database URL」或「External Database URL」

### 3. 在 Render 建立 Web 服務

1. 在 Render Dashboard 點選「New +」→「Web Service」
2. 連接您的 GitHub 儲存庫
3. 設定服務：
   - **Name**: material-request-system
   - **Environment**: Node
   - **Region**: 與資料庫相同區域
   - **Branch**: main
   - **Root Directory**: (留空)
   - **Runtime**: Node
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free 或 Starter

### 4. 設定環境變數

在 Web Service 的「Environment」頁籤中，添加以下環境變數：

#### 必要變數
```
NODE_ENV=production
PORT=5000
DATABASE_URL=<從PostgreSQL服務複製的URL>
JWT_SECRET=<產生一個強密鑰，可用 openssl rand -base64 32 產生>
FRONTEND_URL=<您的Render服務URL，例如 https://material-request-system.onrender.com>
```

#### 可選變數（依需求設定）
```
GOOGLE_CLIENT_ID=<您的Google OAuth Client ID>
GOOGLE_CLIENT_SECRET=<您的Google OAuth Client Secret>
GOOGLE_REDIRECT_URI=<您的Render URL>/api/auth/google/callback

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<您的郵箱>
SMTP_PASS=<您的郵箱密碼或應用程式密碼>
SMTP_FROM=<發件人郵箱>

LINE_NOTIFY_CLIENT_ID=<您的LINE Notify Client ID>
LINE_NOTIFY_CLIENT_SECRET=<您的LINE Notify Client Secret>
LINE_NOTIFY_REDIRECT_URI=<您的Render URL>/api/auth/line/callback

GOOGLE_DRIVE_CLIENT_ID=<您的Google Drive API Client ID>
GOOGLE_DRIVE_CLIENT_SECRET=<您的Google Drive API Client Secret>
GOOGLE_DRIVE_REDIRECT_URI=<您的Render URL>/api/drive/callback
GOOGLE_DRIVE_REFRESH_TOKEN=<您的Refresh Token>

TRIAL_EMAIL=trial@example.com
TRIAL_PASSWORD=trial123
```

### 5. 部署

1. 點選「Manual Deploy」→「Deploy latest commit」
2. 等待部署完成（首次部署可能需要 5-10 分鐘）
3. 部署完成後，訪問您的服務 URL

### 6. 驗證部署

1. 訪問 `https://您的服務URL/health` 應該看到 `{"status":"ok"}`
2. 訪問首頁應該看到登入頁面
3. 使用試用帳號登入測試功能

## 部署後的注意事項

1. **首次啟動**：系統會自動建立資料庫表格
2. **免費方案限制**：Render Free 方案在閒置 15 分鐘後會休眠，首次訪問會較慢
3. **環境變數更新**：修改環境變數後需要重新部署服務
4. **資料庫備份**：建議定期備份資料庫

## 故障排除

### 部署失敗
- 檢查 Build Command 是否正確
- 查看 Build Logs 找出錯誤
- 確認所有環境變數已設定

### 資料庫連接失敗
- 確認 DATABASE_URL 格式正確
- 檢查資料庫是否在運行
- 確認 Internal/External URL 使用正確

### 應用無法啟動
- 檢查 Start Command
- 查看 Runtime Logs
- 確認 PORT 環境變數設定

## 自動部署

當您推送到 GitHub 的 main 分支時，Render 會自動觸發重新部署。

## 更新應用

```bash
# 在本地修改程式碼
git add .
git commit -m "更新說明"
git push origin main

# Render 會自動部署
```

