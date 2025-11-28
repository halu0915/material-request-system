# 快速開始指南

## 1. 安裝依賴

```bash
npm run install:all
```

## 2. 設定資料庫

確保PostgreSQL已安裝並運行，然後建立資料庫：

```sql
CREATE DATABASE material_request_db;
```

## 3. 設定環境變數

建立 `.env` 檔案（參考 `ENV_SETUP.md`），至少需要設定：

- `DATABASE_URL`: PostgreSQL連接字串
- `JWT_SECRET`: JWT密鑰（開發環境可隨意設定）

## 4. 啟動開發伺服器

```bash
npm run dev
```

這將同時啟動：
- 後端伺服器：http://localhost:5000
- 前端應用：http://localhost:3000

## 5. 首次使用

1. 開啟瀏覽器訪問 http://localhost:3000
2. 使用試用帳號登入（在 `.env` 中設定）
3. 開始使用系統

## 下一步

- 設定Google OAuth（參考 `README.md`）
- 設定郵件服務
- 設定LINE通知
- 匯入材料資料

## 問題排除

### 資料庫連接失敗
- 確認PostgreSQL服務正在運行
- 檢查 `DATABASE_URL` 設定是否正確
- 確認資料庫已建立

### 端口被佔用
- 修改 `.env` 中的 `PORT` 設定
- 或修改 `client/vite.config.ts` 中的端口設定

### 依賴安裝失敗
- 確認Node.js版本為18+
- 嘗試清除快取：`npm cache clean --force`
- 刪除 `node_modules` 重新安裝

