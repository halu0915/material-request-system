# SMTP_FROM 環境變數設定說明

## 📧 什麼是 SMTP_FROM？

`SMTP_FROM` 是用來設定郵件發送時顯示的**發送者地址**（寄件人地址）。

## 🔍 是否需要設定？

**`SMTP_FROM` 是**可選的**環境變數**，不是必須的。

### 代碼邏輯：
```typescript
from: process.env.SMTP_FROM || process.env.SMTP_USER
```

- 如果設定了 `SMTP_FROM`，系統會使用它作為發送者地址
- 如果**沒有設定**，系統會自動使用 `SMTP_USER`（您的 Gmail 地址）作為發送者地址

## 💡 為什麼要設定 SMTP_FROM？

### 優點：
1. **更專業**：顯示為 `noreply@yourcompany.com` 或 `system@yourcompany.com`，而不是個人 Gmail
2. **品牌識別**：使用公司域名，提升企業形象
3. **分類管理**：可以設定專門的系統郵件地址

### 缺點：
- 大部分郵件服務商（如 Gmail）要求發送者地址必須與登入帳號相同
- 如果設定了不同的 `SMTP_FROM`，可能被當作垃圾郵件或發送失敗

## ⚙️ 如何設定？

### 方法 1：使用 Gmail（推薦 - 不設定 SMTP_FROM）

如果您使用 Gmail SMTP，**建議不設定 `SMTP_FROM`**，讓系統自動使用您的 Gmail 地址：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
# SMTP_FROM 不設定（系統會使用 SMTP_USER）
```

### 方法 2：使用 Gmail 別名（可設定）

Gmail 支援別名功能，您可以使用：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email+system@gmail.com  # Gmail 別名
```

Gmail 會將 `your-email+system@gmail.com` 自動轉發到 `your-email@gmail.com`，這樣可以：
- 在收件箱中自動分類
- 使用不同的發送者名稱
- 保持與登入帳號一致（避免被當作垃圾郵件）

### 方法 3：使用自有域名郵件服務

如果您有自有的郵件服務（如 Google Workspace、Microsoft 365），可以設定：

```env
SMTP_HOST=smtp.gmail.com  # 或您的郵件服務 SMTP
SMTP_PORT=587
SMTP_USER=system@yourcompany.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourcompany.com  # 可以是不同的地址
```

## 📝 在 Render 上設定

### 步驟：

1. 登入 Render Dashboard
2. 進入您的服務設定頁面
3. 找到 **Environment**（環境變數）區塊
4. 點擊 **Add Environment Variable**
5. 設定如下：

   - **Key**: `SMTP_FROM`
   - **Value**: 
     - **Gmail 用戶**：留空或使用 `your-email+system@gmail.com`（別名）
     - **企業郵件**：`noreply@yourcompany.com` 或 `system@yourcompany.com`

6. 點擊 **Save Changes**

## ⚠️ 注意事項

### 1. Gmail 限制
- Gmail 通常要求發送者地址必須與登入帳號相同或使用別名
- 設定完全不同的地址可能導致發送失敗

### 2. 垃圾郵件風險
- 如果 `SMTP_FROM` 與 `SMTP_USER` 不一致，可能被收件伺服器當作垃圾郵件
- 建議在相同域名下使用

### 3. 測試建議
- 設定後先發送測試郵件
- 檢查是否成功送達
- 確認是否被標記為垃圾郵件

## ✅ 推薦設定

### 如果您使用 Gmail（最簡單）：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
# SMTP_FROM 不設定 - 讓系統使用 SMTP_USER
```

### 如果您想使用 Gmail 別名：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email+system@gmail.com  # 別名（可選）
```

### 顯示名稱設定（進階）

如果您想自訂顯示名稱，可以在代碼中修改：

```typescript
from: `"系統通知" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`
```

這樣郵件會顯示為：
```
系統通知 <your-email@gmail.com>
```

## 📚 相關環境變數

| 環境變數 | 必填 | 說明 | 範例 |
|---------|------|------|------|
| `SMTP_HOST` | ✅ 是 | SMTP 伺服器地址 | `smtp.gmail.com` |
| `SMTP_PORT` | ✅ 是 | SMTP 端口 | `587` |
| `SMTP_USER` | ✅ 是 | 登入帳號 | `your-email@gmail.com` |
| `SMTP_PASS` | ✅ 是 | 應用程式密碼 | `xxxx xxxx xxxx xxxx` |
| `SMTP_FROM` | ❌ 否 | 發送者地址（可選） | `noreply@yourcompany.com` |

## 🔧 常見問題

### Q1: 可以不設定 SMTP_FROM 嗎？
**A:** 可以！系統會自動使用 `SMTP_USER` 作為發送者地址。

### Q2: SMTP_FROM 和 SMTP_USER 必須相同嗎？
**A:** 不一定，但建議相同或使用別名，以避免被當作垃圾郵件。

### Q3: 如何測試設定是否正確？
**A:** 建立一個新的叫料單，系統會自動發送郵件。檢查郵件是否成功送達。

---

**總結**：`SMTP_FROM` 是**可選**的，如果使用 Gmail，建議**不設定**或使用 Gmail 別名。

