# 環境變數設定說明

請在專案根目錄建立 `.env` 檔案，並根據以下說明設定環境變數。

## 基本設定

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/material_request_db

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Google OAuth 設定

如需使用Google登入功能，請設定：

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

## 郵件設定

如需自動發送郵件通知，請設定SMTP：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
SMTP_FROM=noreply@materialrequest.com
```

## LINE Notify 設定

如需LINE通知功能，請設定：

```env
LINE_NOTIFY_CLIENT_ID=your-line-notify-client-id
LINE_NOTIFY_CLIENT_SECRET=your-line-notify-client-secret
LINE_NOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/line/callback
```

## Google Drive 設定

如需自動上傳Excel到Google雲端硬碟，請設定：

```env
GOOGLE_DRIVE_CLIENT_ID=your-google-drive-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-google-drive-client-secret
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:5000/api/drive/callback
GOOGLE_DRIVE_REFRESH_TOKEN=your-refresh-token
```

## 試用帳號設定

設定試用帳號的登入資訊：

```env
TRIAL_EMAIL=trial@example.com
TRIAL_PASSWORD=trial123
```

## 注意事項

1. 生產環境請使用強密鑰作為 `JWT_SECRET`
2. 所有敏感資訊請妥善保管，不要提交到版本控制系統
3. 生產環境請將 `NODE_ENV` 設為 `production`
4. 確保 `.env` 檔案已加入 `.gitignore`

