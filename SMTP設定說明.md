# SMTP 郵件設定說明

## 📧 Gmail SMTP 設定步驟

### 步驟 1：啟用 Gmail 兩步驟驗證

1. 登入您的 Gmail 帳號
2. 前往 [Google 帳戶安全性設定](https://myaccount.google.com/security)
3. 在「登入 Google」區塊中，點擊「兩步驟驗證」
4. 按照指示啟用兩步驟驗證

### 步驟 2：建立應用程式密碼

1. 啟用兩步驟驗證後，前往 [應用程式密碼](https://myaccount.google.com/apppasswords)
2. 選擇「郵件」和「其他（自訂名稱）」
3. 輸入應用程式名稱（例如：叫料系統）
4. 點擊「產生」
5. 記錄下生成的 16 位應用程式密碼（格式：xxxx xxxx xxxx xxxx）

### 步驟 3：設定環境變數

在 Render Dashboard 或 `.env` 檔案中設定：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-digit-app-password
SMTP_FROM=noreply@your-domain.com
```

**重要注意事項：**
- `SMTP_PASS` 必須使用**應用程式密碼**，不能使用 Gmail 帳號密碼
- 應用程式密碼的 16 位數字之間的空格可以保留或移除
- `SMTP_FROM` 可以是您的 Gmail 地址或自訂的發送地址

## 🔧 其他 SMTP 服務設定

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
```

### Yahoo Mail

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@yahoo.com
```

### 自訂 SMTP 伺服器

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587  # 或 465 (SSL)
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
SMTP_FROM=noreply@your-domain.com
```

## 📋 完整的環境變數清單

### 郵件相關

```env
# SMTP 設定
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@your-domain.com

# 採購郵件收件人（多個收件人用逗號分隔）
PURCHASE_EMAIL_RECIPIENTS=procurement@example.com,manager@example.com,buyer@example.com
```

### Google Drive 相關

```env
GOOGLE_DRIVE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret
GOOGLE_DRIVE_REDIRECT_URI=https://your-app.onrender.com/api/drive/callback
GOOGLE_DRIVE_REFRESH_TOKEN=your-refresh-token
```

### 公司資訊（可選）

```env
COMPANY_NAME=您的公司名稱
COMPANY_TAX_ID=您的統編
```

## ✅ 測試郵件功能

設定完成後，建立一個測試叫料單，系統會自動：
1. 生成 Excel 檔案
2. 發送郵件給設定的收件人
3. 檢查 Render 日誌確認發送狀態

## ⚠️ 常見問題

### 問題 1：郵件發送失敗 - 認證錯誤

**解決方法：**
- 確認使用應用程式密碼而非 Gmail 帳號密碼
- 確認已啟用兩步驟驗證
- 檢查 `SMTP_USER` 是否正確

### 問題 2：郵件發送失敗 - 連線錯誤

**解決方法：**
- 確認 `SMTP_HOST` 和 `SMTP_PORT` 正確
- Gmail 使用 `smtp.gmail.com` 和 `587`
- 檢查防火牆設定

### 問題 3：郵件進入垃圾郵件

**解決方法：**
- 使用公司網域的 SMTP 伺服器
- 設定 SPF 和 DKIM 記錄
- 確保 `SMTP_FROM` 與發送帳號一致

## 📞 需要協助？

如果遇到問題，請檢查：
1. Render 日誌中的錯誤訊息
2. 環境變數是否正確設定
3. SMTP 服務提供商的設定要求

