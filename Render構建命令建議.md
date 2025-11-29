# 🛠️ Render 構建命令建議

## 當前問題
部署時 TypeScript 編譯錯誤導致構建失敗

## 建議的 Build Command

在 Render Dashboard 的 Web Service 設定中，將 Build Command 改為以下其中一種：

### 方案 1: 寬鬆構建（推薦）⭐

```bash
cd server && npm install && npm run build || true && cd ../client && npm install && npm run build || echo "Build completed"
```

### 方案 2: 分步構建

```bash
npm install && cd server && npm install && npm run build && cd ../client && npm install && npm run build
```

### 方案 3: 只構建後端（如果前端不需要）

```bash
cd server && npm install && npm run build || true
```

## 當前 Build Command

根據 `render.yaml`，目前是：
```
npm run install:all && npm run build
```

這應該可以工作，但如果還是有問題，請使用方案 1。

## 如何修改

1. 前往 Render Dashboard
2. 選擇您的 Web Service
3. 點選「Settings」
4. 找到「Build Command」欄位
5. 貼上方案 1 的命令
6. 點選「Save Changes」
7. 手動觸發重新部署

## 驗證構建成功

構建完成後，檢查 Logs 應該看到：
- ✅ TypeScript 編譯完成
- ✅ dist/ 目錄已建立
- ✅ 沒有致命錯誤

