# 🔄 更新現有 Render 部署到 fix-mobile-ui 分支

## ✅ 前提條件

- ✅ 代碼已推送到 GitHub：`fix-mobile-ui` 分支
- ✅ Render 上已有部署的服務（使用 `main` 分支）

## 📋 更新步驟

### 方法 1: 在 Render Dashboard 修改分支（推薦）

1. **登入 Render Dashboard**
   - 前往：https://dashboard.render.com
   - 找到您的現有服務：`material-request-system`

2. **修改分支設置**
   - 點選服務進入詳情頁
   - 點選左側選單的「Settings」
   - 找到「Build & Deploy」區塊
   - 找到「Branch」設定
   - 將分支從 `main` 改為 `fix-mobile-ui`
   - 點選「Save Changes」

3. **觸發重新部署**
   - 點選「Manual Deploy」標籤
   - 選擇「Deploy latest commit」
   - 或點選「Deploy」按鈕
   - 等待構建完成（約 5-10 分鐘）

### 方法 2: 使用 Manual Deploy 指定分支

1. **進入服務詳情**
   - 在 Render Dashboard 點選您的服務

2. **手動部署指定分支**
   - 點選「Manual Deploy」標籤
   - 在「Branch」下拉選單中選擇 `fix-mobile-ui`
   - 點選「Deploy latest commit」
   - 等待構建完成

## ⚙️ 檢查環境變數

在更新部署前，建議檢查環境變數是否正確：

1. 點選服務的「Environment」標籤
2. 確認以下變數已設定：
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DATABASE_URL`（您的 PostgreSQL Internal URL）
   - `JWT_SECRET`（如果還沒有，使用：`/z91t1/hmI6Por9hnvx4RPmAETXbXrGErxULdfOvl1c=`）
   - `FRONTEND_URL`（您的服務 URL）

## 🔍 部署後檢查

### 1. 查看構建日誌

- 點選「Logs」標籤
- 查看構建過程是否有錯誤
- 確認構建成功訊息

### 2. 檢查服務狀態

- 確認服務狀態為「Live」
- 檢查是否有錯誤訊息

### 3. 測試應用

- 訪問您的服務 URL
- 測試主要功能是否正常
- 確認新功能（跳過登入）是否生效

## ⚠️ 注意事項

1. **構建時間**：首次從新分支構建可能需要 5-10 分鐘
2. **服務中斷**：部署過程中服務可能會短暫中斷
3. **環境變數**：切換分支不會影響環境變數設置
4. **資料庫**：使用相同的資料庫，數據不會丟失

## 🔄 如果需要回退

如果新分支有問題，可以快速回退：

1. 在「Settings」中將分支改回 `main`
2. 點選「Manual Deploy」→「Deploy latest commit」
3. 等待構建完成

## 📝 更新內容

本次 `fix-mobile-ui` 分支包含的更新：

- ✅ 修復重複代碼問題（Login.tsx, Register.tsx, api.ts）
- ✅ 更新端口配置（5000 → 5001，但 Render 使用 5000）
- ✅ 跳過登入檢查（可直接訪問應用）
- ✅ 修復數據庫連接配置
- ✅ 優化構建流程

## 🎯 快速操作步驟

1. 登入 Render Dashboard
2. 選擇 `material-request-system` 服務
3. Settings → Branch → 改為 `fix-mobile-ui`
4. Save Changes
5. Manual Deploy → Deploy latest commit
6. 等待構建完成
7. 測試應用

完成！


