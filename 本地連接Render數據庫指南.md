# 🔗 本地連接 Render PostgreSQL 數據庫指南

## 📋 步驟說明

### 步驟 1: 獲取 External Database URL

1. **登入 Render Dashboard**
   - 前往：https://dashboard.render.com
   - 找到您的 PostgreSQL 服務（例如：`material-request-db`）

2. **複製 External Database URL**
   - 在資料庫頁面中，找到「**External Database URL**」
   - **重要**：必須使用 **External** URL，不是 Internal URL
   - 格式類似：`postgresql://user:password@dpg-xxxxx-a.singapore-postgres.render.com:5432/dbname`
   - 點選「Copy」複製完整 URL

### 步驟 2: 配置本地 .env 文件

在 `server/.env` 文件中添加：

```env
# 服務器端口
PORT=5001

# 數據庫連接（使用 External Database URL）
DATABASE_URL=postgresql://user:password@dpg-xxxxx-a.singapore-postgres.render.com:5432/dbname

# 開發環境
NODE_ENV=development

# JWT 密鑰（開發環境可隨意設定）
JWT_SECRET=your-local-dev-secret-key

# 前端 URL（本地開發）
FRONTEND_URL=http://localhost:3000
```

### 步驟 3: 測試連接

```bash
# 進入 server 目錄
cd server

# 啟動開發服務器
npm run dev
```

如果連接成功，您會看到：
```
✅ 資料庫連接成功
```

## ⚠️ 注意事項

1. **使用 External URL**：本地連接必須使用 External Database URL，不是 Internal URL
2. **SSL 連接**：Render 的 PostgreSQL 需要 SSL 連接，代碼已自動處理
3. **防火牆**：某些網絡環境可能需要配置防火牆規則
4. **連接限制**：Free 計劃可能有連接數限制

## 🔍 故障排除

### 連接失敗

1. **檢查 URL 格式**
   - 確認使用 External Database URL
   - 確認 URL 包含端口號（通常是 5432）

2. **檢查網絡連接**
   ```bash
   # 測試是否可以連接到 Render 數據庫
   ping dpg-xxxxx-a.singapore-postgres.render.com
   ```

3. **檢查環境變數**
   ```bash
   cd server
   cat .env | grep DATABASE_URL
   ```

4. **查看詳細錯誤**
   - 檢查服務器日誌中的錯誤訊息
   - 確認錯誤是否與 SSL、認證或網絡相關

### 常見錯誤

- **`ECONNREFUSED`**：網絡無法連接到 Render 數據庫
- **`authentication failed`**：用戶名或密碼錯誤
- **`SSL required`**：需要啟用 SSL（代碼已處理）

## 📝 完整 .env 範例

```env
# === 服務器配置 ===
PORT=5001
NODE_ENV=development

# === 數據庫配置（Render External URL）===
DATABASE_URL=postgresql://material_request_db_user:your_password@dpg-xxxxx-a.singapore-postgres.render.com:5432/material_request_db

# === JWT 配置 ===
JWT_SECRET=local-development-secret-key-change-in-production

# === 前端配置 ===
FRONTEND_URL=http://localhost:3000

# === 試用帳號（可選）===
TRIAL_EMAIL=trial@material-request.com
TRIAL_PASSWORD=trial123456
```

## ✅ 驗證連接

連接成功後，您應該能夠：
- ✅ 啟動服務器無錯誤
- ✅ 看到「資料庫連接成功」訊息
- ✅ 數據表自動創建
- ✅ 可以進行數據庫操作

