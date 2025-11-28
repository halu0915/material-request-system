# 🚀 快速部署指南

## 步驟 1: 準備 Git 和 GitHub

### 1.1 確認專案已準備
```bash
./pre-deploy.sh
```

### 1.2 在 GitHub 建立新儲存庫
1. 前往 https://github.com/new
2. 輸入儲存庫名稱（例如：`material-request-system`）
3. **不要**勾選「Initialize this repository with a README」
4. 點選「Create repository」

### 1.3 連接並推送
```bash
# 方法一：使用互動式腳本
./deploy-commands.sh

# 方法二：手動執行
git add .
git commit -m "Initial commit: 叫料系統"
git branch -M main
git remote add origin https://github.com/您的帳號/儲存庫名稱.git
git push -u origin main
```

## 步驟 2: 在 Render 建立資料庫

1. 前往 [Render Dashboard](https://dashboard.render.com)
2. 點選「New +」→「PostgreSQL」
3. 設定：
   - **Name**: `material-request-db`
   - **Database**: `material_request_db`
   - **Region**: 選擇靠近您的區域（建議選擇與 Web Service 相同）
   - **Plan**: Free（開發）或 Starter（生產）
4. 點選「Create Database」
5. **重要**：複製「Internal Database URL」（稍後會用到）

## 步驟 3: 在 Render 建立 Web Service

### 3.1 建立服務
1. 在 Render Dashboard 點選「New +」→「Web Service」
2. 選擇「Connect account」連接 GitHub
3. 選擇您的儲存庫
4. 點選「Connect」

### 3.2 設定服務參數
- **Name**: `material-request-system`
- **Environment**: `Node`
- **Region**: 與資料庫相同
- **Branch**: `main`
- **Root Directory**: *(留空)*
- **Runtime**: `Node`
- **Build Command**: `npm run install:all && npm run build`
- **Start Command**: `cd server && npm start`
- **Plan**: Free 或 Starter

### 3.3 設定環境變數
在「Environment」頁籤添加以下變數：

#### 🔴 必要變數（必須設定）
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=<從PostgreSQL複製的Internal Database URL>
JWT_SECRET=<使用以下指令產生: openssl rand -base64 32>
FRONTEND_URL=<您的Render服務URL，例如: https://material-request-system.onrender.com>
```

#### 🟡 可選變數（依需求設定）
```bash
# 試用帳號
TRIAL_EMAIL=trial@example.com
TRIAL_PASSWORD=trial123

# Google OAuth (選填)
GOOGLE_CLIENT_ID=<您的Google Client ID>
GOOGLE_CLIENT_SECRET=<您的Google Client Secret>
GOOGLE_REDIRECT_URI=<您的Render URL>/api/auth/google/callback

# 郵件服務 (選填)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<您的郵箱>
SMTP_PASS=<應用程式密碼>
SMTP_FROM=<發件人郵箱>

# LINE Notify (選填)
LINE_NOTIFY_CLIENT_ID=<您的Client ID>
LINE_NOTIFY_CLIENT_SECRET=<您的Client Secret>

# Google Drive (選填)
GOOGLE_DRIVE_CLIENT_ID=<您的Client ID>
GOOGLE_DRIVE_CLIENT_SECRET=<您的Client Secret>
GOOGLE_DRIVE_REFRESH_TOKEN=<您的Refresh Token>
```

### 3.4 產生 JWT Secret
在終端執行：
```bash
openssl rand -base64 32
```
將結果複製到 `JWT_SECRET` 環境變數

### 3.5 部署
1. 點選「Create Web Service」
2. 等待部署完成（首次約 5-10 分鐘）
3. 部署完成後，點選服務 URL 測試

## 步驟 4: 驗證部署

### 4.1 健康檢查
訪問：`https://您的服務URL/health`
應該看到：`{"status":"ok","timestamp":"..."}`

### 4.2 測試登入
1. 訪問首頁
2. 使用試用帳號登入（在環境變數中設定的帳號）
3. 測試建立叫料單功能

## 🎉 完成！

您的叫料系統已成功部署到 Render！

## 📝 後續更新

每次修改程式碼後：
```bash
git add .
git commit -m "更新說明"
git push origin main
```

Render 會自動重新部署。

## ❓ 問題排除

### 部署失敗
- 檢查 Build Logs 找出錯誤
- 確認所有環境變數已正確設定
- 檢查 Build Command 是否正確

### 資料庫連接失敗
- 確認使用「Internal Database URL」而非 External
- 檢查 DATABASE_URL 格式是否正確

### 應用無法啟動
- 查看 Runtime Logs
- 確認 PORT 環境變數設定
- 檢查資料庫連接

## 📚 更多資訊

- 完整文檔：`README.md`
- 環境變數說明：`ENV_SETUP.md`
- 詳細部署指南：`DEPLOY.md`

