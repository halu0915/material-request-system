# Gmail SMTP 設定快速檢查清單

## 🔴 當前錯誤

```
Invalid login: 535-5.7.8 Username and Password not accepted
錯誤代碼: EAUTH
回應碼: 535
```

## ✅ 快速檢查清單

### 步驟 1：確認 Gmail 帳號設定

- [ ] **已啟用兩步驟驗證**
  - 前往：https://myaccount.google.com/security
  - 確認「兩步驟驗證」已啟用
  - 如果未啟用，請先啟用

- [ ] **已產生應用程式密碼**
  - 前往：https://myaccount.google.com/apppasswords
  - 確認已產生「郵件」類別的應用程式密碼
  - 如果未產生，請立即產生

### 步驟 2：檢查 Render 環境變數

在 Render Dashboard → Environment 中檢查：

- [ ] **SMTP_HOST**
  ```
  正確：smtp.gmail.com
  錯誤：gmail.com 或其他
  ```

- [ ] **SMTP_PORT**
  ```
  正確：587 或 465
  錯誤：其他數字
  ```

- [ ] **SMTP_USER**
  ```
  正確：your-email@gmail.com（完整的 Gmail 地址）
  錯誤：只有用戶名，缺少 @gmail.com
  ```

- [ ] **SMTP_PASS**
  ```
  正確：16 位應用程式密碼（不含空格）
  例如：abcdefghijklmnop
  
  錯誤：
  ❌ Gmail 帳號密碼
  ❌ 包含空格的應用程式密碼（如：abcd efgh ijkl mnop）
  ❌ 少於或多於 16 位
  ```

### 步驟 3：常見錯誤

#### ❌ 錯誤 1：使用 Gmail 帳號密碼
```
SMTP_PASS=your-gmail-password  ❌ 錯誤！
```
**解決方案：** 必須使用應用程式密碼

#### ❌ 錯誤 2：應用程式密碼包含空格
```
SMTP_PASS=abcd efgh ijkl mnop  ❌ 錯誤！
```
**解決方案：** 移除空格
```
SMTP_PASS=abcdefghijklmnop  ✅ 正確
```

#### ❌ 錯誤 3：SMTP_USER 格式錯誤
```
SMTP_USER=username  ❌ 錯誤！
SMTP_USER=username@gmail  ❌ 錯誤！
```
**解決方案：** 使用完整地址
```
SMTP_USER=username@gmail.com  ✅ 正確
```

#### ❌ 錯誤 4：未啟用兩步驟驗證
**解決方案：**
1. 前往 https://myaccount.google.com/security
2. 啟用兩步驟驗證
3. 然後才能產生應用程式密碼

## 🔧 正確設定範例

```env
# ✅ 正確的 Gmail SMTP 設定
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mycompany@gmail.com
SMTP_PASS=abcdefghijklmnop              # 16位應用程式密碼（不含空格）
SMTP_FROM=mycompany@gmail.com
```

## 📝 設定步驟（詳細）

### 1. 產生應用程式密碼

1. 前往：https://myaccount.google.com/apppasswords
2. 如果看不到此頁面：
   - 先前往：https://myaccount.google.com/security
   - 啟用「兩步驟驗證」
   - 然後再回到應用程式密碼頁面

3. 在應用程式密碼頁面：
   - 「選取應用程式」→ 選擇「郵件」
   - 「選取裝置」→ 選擇「其他（自訂名稱）」
   - 輸入名稱：「叫料系統」
   - 點擊「產生」

4. **複製 16 位密碼**
   - 格式：`xxxx xxxx xxxx xxxx`（4 組，每組 4 位）
   - **重要：只會顯示一次，請立即複製！**

### 2. 在 Render 設定環境變數

1. 前往 Render Dashboard
2. 選擇您的服務
3. 點擊「Environment」標籤
4. 設定或更新以下變數：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx    # 移除空格，變成：xxxxxxxxxxxxxxxx
```

5. **重要：移除應用程式密碼中的空格**
   - 如果應用程式密碼是：`abcd efgh ijkl mnop`
   - 在環境變數中設定為：`abcdefghijklmnop`

6. 點擊「Save Changes」
7. Render 會自動重新部署

### 3. 驗證設定

1. 等待部署完成
2. 嘗試發送郵件
3. 檢查 Render 日誌：
   - ✅ 成功：看到「SMTP 連線驗證成功」和「郵件發送成功」
   - ❌ 失敗：查看錯誤訊息，根據錯誤訊息調整設定

## 🆘 仍無法解決？

如果按照以上步驟設定後仍然失敗，請檢查：

1. **應用程式密碼是否正確**
   - 確認是 16 位字元
   - 確認已移除空格
   - 確認是「郵件」類別的應用程式密碼

2. **Gmail 帳號狀態**
   - 確認帳號未被停用
   - 確認可以正常登入 Gmail
   - 確認兩步驟驗證已啟用

3. **環境變數格式**
   - 確認沒有多餘的空格
   - 確認沒有引號（除非 Render 要求）
   - 確認值正確

4. **重新產生應用程式密碼**
   - 如果懷疑密碼有問題，可以刪除舊的並重新產生
   - 記得更新 Render 中的 SMTP_PASS

## 📚 相關文件

- `Gmail應用程式密碼設定指南.md` - 詳細設定指南
- `SMTP設定說明.md` - SMTP 詳細說明
- `郵件發送問題排查指南.md` - 完整排查指南

