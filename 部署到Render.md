# 🚀 部署到 Render - 完整指南

## ✅ 前置檢查

- ✅ GitHub 儲存庫已建立：https://github.com/halu0915/material-request-system
- ✅ 所有程式碼已推送

## 📋 部署步驟

### 步驟 1: 建立 PostgreSQL 資料庫

1. **前往 Render Dashboard**
   👉 https://dashboard.render.com

2. **建立資料庫**
   - 點選「New +」→「PostgreSQL」
   - 設定：
     - **Name**: `material-request-db`
     - **Database**: `material_request_db`（或使用預設）
     - **Region**: `Singapore`（或選擇靠近您的區域）
     - **Plan**: `Free`（開發環境）或 `Starter`（生產環境）
   - 點選「Create Database」
   - 等待建立完成（約 1-2 分鐘）

3. **複製資料庫 URL**
   - 建立完成後，在資料庫頁面找到「Internal Database URL」
   - **複製這個 URL**（稍後會用到）
   - 格式類似：`postgresql://user:password@dpg-xxxxx-a.singapore-postgres.render.com/dbname`

---

### 步驟 2: 建立 Web Service

1. **連接 GitHub**
   - 在 Render Dashboard 點選「New +」→「Web Service」
   - 點選「Connect account」連接 GitHub（如果還沒連接）
   - 選擇您的帳號，授權 Render 訪問
   - 搜尋並選擇：`material-request-system`
   - 點選「Connect」

2. **設定服務參數**
   
   **基本設定**：
   - **Name**: `material-request-system`
   - **Environment**: `Node`
   - **Region**: 與資料庫相同（例如：Singapore）
   - **Branch**: `main`
   - **Root Directory**: *(留空)*
   - **Runtime**: `Node`
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Plan**: `Free` 或 `Starter`

   **注意**：不要勾選「Auto-Deploy」，先設定環境變數

---

### 步驟 3: 設定環境變數

在 Web Service 的「Environment」頁籤中，添加以下環境變數：

#### 🔴 必要變數（必須設定）

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<從步驟1複製的Internal Database URL>
JWT_SECRET=<見下方產生的密鑰>
FRONTEND_URL=https://material-request-system.onrender.com
```

**JWT Secret**（已為您產生）：
```
請使用下方指令產生的密鑰
```

#### 🟡 可選變數（建議設定試用帳號）

```
TRIAL_EMAIL=trial@material-request.com
TRIAL_PASSWORD=trial123456
```

#### 🟢 其他可選變數（可稍後設定）

```
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://material-request-system.onrender.com/api/auth/google/callback

# 郵件服務
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# LINE Notify
LINE_NOTIFY_CLIENT_ID=
LINE_NOTIFY_CLIENT_SECRET=

# Google Drive
GOOGLE_DRIVE_CLIENT_ID=
GOOGLE_DRIVE_CLIENT_SECRET=
GOOGLE_DRIVE_REFRESH_TOKEN=
```

**重要**：
- `FRONTEND_URL` 中的域名會是 `material-request-system.onrender.com`（或您設定的名稱）
- 部署完成後，Render 會顯示實際的 URL，記得更新 `FRONTEND_URL`

---

### 步驟 4: 部署

1. 確認所有環境變數已設定
2. 點選「Create Web Service」
3. 等待部署完成（首次部署約 5-10 分鐘）

**部署過程會顯示 Build Logs**，您可以：
- 查看安裝進度
- 檢查是否有錯誤
- 確認編譯是否成功

---

### 步驟 5: 驗證部署

部署完成後：

1. **健康檢查**
   訪問：`https://material-request-system.onrender.com/health`
   應該看到：`{"status":"ok","timestamp":"..."}`

2. **測試登入**
   訪問：`https://material-request-system.onrender.com`
   使用試用帳號登入測試

3. **檢查資料庫**
   系統會自動建立資料表（首次啟動時）

---

## 🔧 問題排除

### 部署失敗

**檢查 Build Logs**：
- 查看是否有編譯錯誤
- 確認所有依賴是否正確安裝
- 檢查環境變數是否正確設定

**常見問題**：
- ❌ `npm install` 失敗 → 檢查 `package.json` 是否正確
- ❌ 資料庫連接失敗 → 確認 `DATABASE_URL` 是否正確（使用 Internal URL）
- ❌ 端口錯誤 → 確認 `PORT` 環境變數為 `5000`

### 資料庫連接失敗

1. 確認使用「Internal Database URL」而非 External
2. 檢查資料庫是否在同一區域
3. 確認資料庫服務正在運行

### 應用無法啟動

1. 查看 Runtime Logs
2. 確認 `PORT` 環境變數設定
3. 檢查 `DATABASE_URL` 格式是否正確

---

## 📝 部署完成後

### 更新 FRONTEND_URL

部署完成後，Render 會顯示實際的服務 URL，例如：
```
https://material-request-system-xxxx.onrender.com
```

請更新環境變數 `FRONTEND_URL` 為實際的 URL。

### 設定自訂域名（可選）

如果需要使用自訂域名：
1. 在 Web Service 設定中點選「Settings」
2. 在「Custom Domain」區塊新增域名
3. 按照指示設定 DNS

---

## 🎉 完成！

部署成功後，您的叫料系統就可以使用了！

**儲存庫**: https://github.com/halu0915/material-request-system  
**服務 URL**: https://material-request-system.onrender.com（實際 URL 會顯示在 Render Dashboard）

---

## 📚 相關資源

- Render 文件：https://render.com/docs
- 專案文檔：`README.md`
- 環境變數說明：`ENV_SETUP.md`

