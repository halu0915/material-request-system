# 🧪 API 測試指南

## ✅ 部署成功確認

服務已成功部署並運行：
- **URL**: `https://material-request-system-uadw.onrender.com`
- **狀態**: ✅ 運行中
- **版本**: 1.0.0

## 📋 API 端點測試

### 1. 健康檢查

```bash
GET https://material-request-system-uadw.onrender.com/health
```

預期回應：
```json
{
  "status": "ok",
  "timestamp": "2025-11-29T..."
}
```

### 2. 註冊新帳號

```bash
POST https://material-request-system-uadw.onrender.com/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123456",
  "name": "測試使用者"
}
```

預期回應：
```json
{
  "message": "註冊成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "測試使用者"
  }
}
```

### 3. 登入

```bash
POST https://material-request-system-uadw.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123456"
}
```

### 4. 使用試用帳號登入（如果已設定）

```bash
POST https://material-request-system-uadw.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "trial@material-request.com",
  "password": "trial123456"
}
```

### 5. 取得當前使用者資訊

```bash
GET https://material-request-system-uadw.onrender.com/api/auth/me
Authorization: Bearer <您的token>
```

### 6. 取得施工類別

```bash
GET https://material-request-system-uadw.onrender.com/api/materials/construction-categories
Authorization: Bearer <您的token>
```

### 7. 取得材料類別

```bash
GET https://material-request-system-uadw.onrender.com/api/materials/material-categories
Authorization: Bearer <您的token>
```

### 8. 取得材料列表

```bash
GET https://material-request-system-uadw.onrender.com/api/materials
Authorization: Bearer <您的token>
```

### 9. 建立叫料單

```bash
POST https://material-request-system-uadw.onrender.com/api/requests
Authorization: Bearer <您的token>
Content-Type: application/json

{
  "construction_category_id": 1,
  "items": [
    {
      "material_id": 1,
      "quantity": 10,
      "unit": "包"
    }
  ],
  "notes": "測試叫料單"
}
```

### 10. 取得叫料單列表

```bash
GET https://material-request-system-uadw.onrender.com/api/requests
Authorization: Bearer <您的token>
```

## 🔧 使用 curl 測試

### 測試健康檢查

```bash
curl https://material-request-system-uadw.onrender.com/health
```

### 測試註冊

```bash
curl -X POST https://material-request-system-uadw.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "測試使用者"
  }'
```

### 測試登入並取得 token

```bash
curl -X POST https://material-request-system-uadw.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

將回應中的 `token` 儲存，然後用於後續請求：

```bash
TOKEN="您的token"

curl -X GET https://material-request-system-uadw.onrender.com/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 📱 使用 Postman 或類似工具

1. 匯入以下環境變數：
   - `base_url`: `https://material-request-system-uadw.onrender.com`
   - `token`: (登入後取得)

2. 建立請求集合：
   - 註冊
   - 登入
   - 取得使用者資訊
   - 取得材料列表
   - 建立叫料單

## ✅ 測試檢查清單

- [ ] 健康檢查正常
- [ ] 註冊功能正常
- [ ] 登入功能正常
- [ ] 取得使用者資訊正常
- [ ] 取得材料列表正常
- [ ] 建立叫料單正常
- [ ] 取得叫料單列表正常

## 🔑 重要提醒

所有需要認證的端點都需要在 Header 中包含：
```
Authorization: Bearer <您的token>
```

## 🎉 下一步

API 測試成功後，您可以：
1. 設定環境變數（資料庫、JWT Secret 等）
2. 構建並部署前端應用
3. 開始使用系統

