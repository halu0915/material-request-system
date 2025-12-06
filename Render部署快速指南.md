# 🚀 Render 部署快速指南

## ✅ 前置準備

- ✅ 代碼已推送到 GitHub: https://github.com/halu0915/material-request-system
- ✅ 當前分支: `fix-mobile-ui`
- ✅ 已配置 PostgreSQL 資料庫連接

## 📋 部署步驟

### 步驟 1: 確認 PostgreSQL 資料庫

如果您已經有資料庫（jiao_liao_xi_tong），可以跳過此步驟。

如果需要新建：
1. 前往 https://dashboard.render.com
2. 點選「New +」→「PostgreSQL」
3. 設定：
   - **Name**: `material-request-db`
   - **Database**: `jiao_liao_xi_tong`
   - **Region**: `Singapore`
   - **Plan**: `Free`
4. 點選「Create Database」
5. 等待建立完成後，複製「Internal Database URL」

### 步驟 2: 建立 Web Service

1. **連接 GitHub**
   - 在 Render Dashboard 點選「New +」→「Web Service」
   - 點選「Connect account」（如果還沒連接 GitHub）
   - 選擇您的 GitHub 帳號並授權
   - 搜尋並選擇：`material-request-system`
   - 點選「Connect」

2. **設定服務參數**
   - **Name**: `material-request-system`
   - **Environment**: `Node`
   - **Region**: 與資料庫相同（建議 `Singapore`）
   - **Branch**: `fix-mobile-ui`（或 `main`）
   - **Root Directory**: （留空）
   - **Runtime**: `Node`
   - **Build Command**: `bash build.sh`
   - **Start Command**: `cd server && npm start`
   - **Plan**: `Free`

### 步驟 3: 設定環境變數

在 Web Service 的「Environment」頁籤中，添加以下環境變數：

#### 🔴 必要變數（必須設定）

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<從 PostgreSQL 複製的 Internal Database URL>
JWT_SECRET=<使用下方指令產生的密鑰>
FRONTEND_URL=https://material-request-system.onrender.com
```

**生成 JWT_SECRET**（在終端執行）：
```bash
openssl rand -base64 32
```

#### 🟡 建議設定的變數

```
TRIAL_EMAIL=trial@material-request.com
TRIAL_PASSWORD=trial123456
```

#### 🟢 可選變數（可稍後設定）

```
# Google OAuth（如果需要）
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://material-request-system.onrender.com/api/auth/google/callback

# 郵件服務（如果需要）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

### 步驟 4: 開始部署

1. 確認所有環境變數都已設定
2. 點選「Create Web Service」
3. 等待構建完成（約 5-10 分鐘）
4. 構建成功後，服務會自動啟動

## 🔍 部署後檢查

### 檢查服務狀態

1. 在 Render Dashboard 查看服務狀態
2. 點選「Logs」標籤查看日誌
3. 確認沒有錯誤訊息

### 測試應用

1. 訪問您的服務 URL（例如：`https://material-request-system.onrender.com`）
2. 檢查是否能正常載入
3. 測試主要功能

## ⚠️ 常見問題

### 構建失敗

- 檢查 Build Command 是否正確：`bash build.sh`
- 查看 Logs 中的錯誤訊息
- 確認所有依賴都已正確安裝

### 服務無法啟動

- 檢查 Start Command：`cd server && npm start`
- 確認 `server/dist/index.js` 文件存在
- 檢查環境變數是否正確設定

### 資料庫連接失敗

- 確認 `DATABASE_URL` 使用的是 **Internal Database URL**（不是 External）
- 確認資料庫服務正在運行
- 檢查資料庫區域是否與 Web Service 相同

### 前端無法載入

- 確認前端構建成功（`client/dist/index.html` 存在）
- 檢查 `FRONTEND_URL` 是否正確
- 查看服務器日誌確認靜態文件服務正常

## 📝 注意事項

1. **Free Plan 限制**：
   - 服務在 15 分鐘無活動後會休眠
   - 首次訪問需要等待服務喚醒（約 30-60 秒）

2. **資料庫連接**：
   - 必須使用 **Internal Database URL**（不是 External）
   - 確保資料庫和 Web Service 在同一區域

3. **環境變數**：
   - 所有敏感資訊（如 JWT_SECRET、資料庫密碼）都應在 Render Dashboard 設定
   - 不要將 `.env` 文件提交到 Git

4. **構建時間**：
   - 首次構建可能需要 5-10 分鐘
   - 後續更新構建通常更快

## 🔄 更新部署

當您推送新代碼到 GitHub 時：
1. Render 會自動檢測更改（如果啟用了 Auto-Deploy）
2. 自動觸發新的構建
3. 構建完成後自動重啟服務

如果需要手動部署：
1. 在 Render Dashboard 點選服務
2. 點選「Manual Deploy」
3. 選擇要部署的分支和提交

## 📞 需要幫助？

如果遇到問題：
1. 查看 Render Dashboard 的 Logs
2. 檢查構建日誌中的錯誤訊息
3. 確認所有環境變數都已正確設定


