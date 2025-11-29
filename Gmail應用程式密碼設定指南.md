# Gmail 應用程式密碼設定指南

## 🔴 錯誤訊息

```
Invalid login: 535-5.7.8 Username and Password not accepted
錯誤代碼: EAUTH
回應碼: 535
```

## ✅ 解決方案：使用 Gmail 應用程式密碼

Gmail **不允許**直接使用帳號密碼進行 SMTP 認證，必須使用「應用程式密碼」。

## 📋 設定步驟

### 步驟 1：啟用兩步驟驗證

1. 前往 [Google 帳戶](https://myaccount.google.com/)
2. 點擊左側「安全性」
3. 在「登入 Google」區塊中，找到「兩步驟驗證」
4. 如果未啟用，點擊「開始使用」並完成設定
5. **必須先啟用兩步驟驗證，才能產生應用程式密碼**

### 步驟 2：產生應用程式密碼

1. 前往 [Google 帳戶](https://myaccount.google.com/)
2. 點擊左側「安全性」
3. 在「登入 Google」區塊中，找到「應用程式密碼」
   - 如果看不到此選項，請先完成步驟 1（啟用兩步驟驗證）
4. 在「選取應用程式」下拉選單中，選擇「郵件」
5. 在「選取裝置」下拉選單中，選擇「其他（自訂名稱）」
6. 輸入名稱，例如：「叫料系統 SMTP」
7. 點擊「產生」
8. **複製產生的 16 位密碼**（格式：`xxxx xxxx xxxx xxxx`）
   - ⚠️ **重要：這個密碼只會顯示一次，請立即複製**

### 步驟 3：在 Render 設定環境變數

1. 前往 Render Dashboard
2. 選擇您的服務
3. 點擊「Environment」標籤
4. 設定以下環境變數：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com          # 您的 Gmail 地址
SMTP_PASS=xxxx xxxx xxxx xxxx          # 步驟 2 產生的 16 位應用程式密碼（不含空格）
SMTP_FROM=your-email@gmail.com         # 可選，預設使用 SMTP_USER
```

**重要注意事項：**
- `SMTP_PASS` 必須使用**應用程式密碼**，不是 Gmail 帳號密碼
- 應用程式密碼是 16 位，可以包含空格，但建議在環境變數中**移除空格**
- 例如：如果應用程式密碼是 `abcd efgh ijkl mnop`，設定為 `abcdefghijklmnop`

### 步驟 4：驗證設定

1. 儲存環境變數後，Render 會自動重新部署
2. 部署完成後，嘗試發送郵件
3. 檢查 Render 日誌：
   - 如果看到「SMTP 連線驗證成功」，表示設定正確
   - 如果看到「郵件發送成功」，表示郵件已發送

## 🔍 常見問題

### Q1: 找不到「應用程式密碼」選項？

**A:** 必須先啟用「兩步驟驗證」才能看到此選項。

### Q2: 應用程式密碼格式是什麼？

**A:** 16 位字元，格式為 `xxxx xxxx xxxx xxxx`（4 組，每組 4 位，用空格分隔）

### Q3: 應用程式密碼可以包含空格嗎？

**A:** 可以，但在環境變數中建議移除空格，設定為連續的 16 位字元。

### Q4: 我已經設定了應用程式密碼，還是失敗？

**檢查清單：**
- [ ] 確認已啟用兩步驟驗證
- [ ] 確認使用的是應用程式密碼，不是 Gmail 帳號密碼
- [ ] 確認 `SMTP_USER` 是完整的 Gmail 地址（包含 @gmail.com）
- [ ] 確認 `SMTP_PASS` 是正確的 16 位應用程式密碼
- [ ] 確認環境變數已儲存並重新部署
- [ ] 檢查 Render 日誌是否有其他錯誤訊息

### Q5: 可以重新產生應用程式密碼嗎？

**A:** 可以，但舊的密碼會立即失效。如果重新產生，記得更新 Render 中的 `SMTP_PASS` 環境變數。

### Q6: 應用程式密碼安全嗎？

**A:** 是的，應用程式密碼比直接使用帳號密碼更安全：
- 可以為不同應用程式產生不同的密碼
- 可以隨時撤銷特定應用程式的密碼
- 不會影響 Gmail 帳號的主要密碼

## 📝 完整環境變數範例

```env
# Gmail SMTP 設定
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mycompany@gmail.com
SMTP_PASS=abcdefghijklmnop                    # 16位應用程式密碼（不含空格）
SMTP_FROM=mycompany@gmail.com

# 採購郵件收件人（可選，多個用逗號分隔）
PURCHASE_EMAIL_RECIPIENTS=procurement@example.com,manager@example.com
```

## 🆘 仍無法解決？

如果按照以上步驟設定後仍然失敗，請檢查：

1. **Render 日誌**
   - 查看是否有其他錯誤訊息
   - 確認錯誤代碼和回應碼

2. **Gmail 帳號狀態**
   - 確認帳號未被停用或限制
   - 確認可以正常登入 Gmail

3. **網路連線**
   - 確認 Render 服務可以連接到 Gmail SMTP 伺服器

4. **替代方案**
   - 考慮使用其他郵件服務（如 SendGrid、Mailgun）
   - 或使用公司郵件伺服器

## 📚 相關文件

- `SMTP設定說明.md` - SMTP 詳細設定說明
- `郵件發送問題排查指南.md` - 完整排查指南
- `雲端上傳與郵件設定指南.md` - 完整設定流程

