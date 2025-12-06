# Render 部署指南 - 公司選擇功能

## 📋 部署步驟

### 1. 在 Render Dashboard 中更新服務

#### 方式 A：切換到 fix-mobile-ui 分支（推薦）

1. 登入 [Render Dashboard](https://dashboard.render.com)
2. 找到您的服務 `material-request-system`
3. 進入服務設置頁面
4. 在 **Settings** → **Build & Deploy** 中：
   - 將 **Branch** 從 `main` 改為 `fix-mobile-ui`
   - 點擊 **Save Changes**
5. 點擊 **Manual Deploy** → **Deploy latest commit**

#### 方式 B：合併到 main 分支後部署

```bash
# 在本地執行
git checkout main
git pull origin main
git merge fix-mobile-ui
git push origin main
```

然後在 Render Dashboard 中點擊 **Manual Deploy** → **Deploy latest commit**

---

### 2. 設置環境變數

在 Render Dashboard 的 **Environment** 頁籤中，添加以下環境變數：

#### 必要環境變數（如果尚未設置）

```
NODE_ENV=production
PORT=5000
DATABASE_URL=<您的 PostgreSQL 連接字串>
JWT_SECRET=<強密鑰，使用 openssl rand -base64 32 產生>
FRONTEND_URL=<您的 Render 服務 URL>
```

#### 新增環境變數（公司資訊）

```
COMPANY_NAME=金鴻空調機電工程有限公司
COMPANY_TAX_ID=16272724
```

#### 可選環境變數（如果使用）

```
GOOGLE_CLIENT_ID=<您的 Google OAuth Client ID>
GOOGLE_CLIENT_SECRET=<您的 Google OAuth Client Secret>
GOOGLE_REDIRECT_URI=<您的 Render URL>/api/auth/google/callback

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<您的郵箱>
SMTP_PASS=<您的郵箱密碼>
SMTP_FROM=noreply@materialrequest.com
```

---

### 3. 確認部署

1. 等待構建完成（通常需要 3-5 分鐘）
2. 檢查構建日誌，確認沒有錯誤
3. 訪問您的服務 URL，測試功能

---

### 4. 驗證功能

部署完成後，請測試以下功能：

1. ✅ **公司選擇功能**
   - 建立叫料單時，表單頂部應顯示公司選擇下拉選單
   - 可以選擇已建立的公司，或留空使用預設值

2. ✅ **Excel 生成**
   - 建立叫料單後，下載 Excel 文件
   - 確認包含三個分頁：叫料單、月統計、圖片連結
   - 確認公司資訊正確顯示

3. ✅ **數據庫遷移**
   - 服務器啟動時應自動創建 `companies` 表
   - `material_requests` 表應包含 `company_id` 欄位

---

### 5. 故障排除

如果遇到問題：

1. **數據庫連接錯誤**
   - 確認 `DATABASE_URL` 正確設置
   - 確認 PostgreSQL 服務正在運行

2. **構建失敗**
   - 檢查構建日誌中的錯誤訊息
   - 確認所有依賴已正確安裝

3. **環境變數未生效**
   - 確認環境變數已保存
   - 重啟服務以使環境變數生效

---

## 📝 注意事項

- 首次部署時，數據庫遷移會自動執行
- 如果數據庫已存在，遷移會安全地添加新表和欄位
- 環境變數更改後需要重啟服務才能生效

---

## 🎉 完成

部署完成後，您的系統將支持：
- ✅ 公司選擇功能
- ✅ Excel 三頁模板（叫料單、月統計、圖片連結）
- ✅ 材料規格支持
- ✅ 月統計自動計算


