# Gmail 別名設定指南

## 📧 什麼是 Gmail 別名？

Gmail 別名讓您可以在同一個 Gmail 帳號下使用不同的郵件地址。所有發送到別名的郵件都會自動轉發到您的主 Gmail 信箱。

### 別名格式：
```
your-email+任意名稱@gmail.com
```

例如：
- `your-email+system@gmail.com`
- `your-email+noreply@gmail.com`
- `your-email+orders@gmail.com`

## ✅ 使用 Gmail 別名的優點

1. **自動分類**：可以在 Gmail 中設定過濾器，自動將不同別名的郵件分類
2. **追蹤來源**：知道郵件是從哪個系統發出的
3. **組織管理**：更好地組織和管理不同用途的郵件
4. **不需要額外設定**：Gmail 自動支援，無需額外配置

## 🔧 設定 SMTP_FROM 使用別名

### 方式 1：基本別名設定

在 Render 環境變數中設定：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email+system@gmail.com
```

**注意**：`SMTP_USER` 必須是您的主 Gmail 地址，`SMTP_FROM` 可以是別名。

### 方式 2：帶顯示名稱的別名（進階）

設定一個友善的顯示名稱：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email+system@gmail.com
SMTP_FROM_NAME=叫料系統
```

這樣郵件會顯示為：
```
叫料系統 <your-email+system@gmail.com>
```

## 📝 在 Render 上設定步驟

### 1. 登入 Render Dashboard

### 2. 進入服務設定

找到您的服務，點擊進入設定頁面。

### 3. 設定環境變數

在 **Environment** 區塊中，點擊 **Add Environment Variable**，依序設定：

#### 必要設定：
- **Key**: `SMTP_HOST`
  - **Value**: `smtp.gmail.com`

- **Key**: `SMTP_PORT`
  - **Value**: `587`

- **Key**: `SMTP_USER`
  - **Value**: `your-email@gmail.com`（您的 Gmail 地址）

- **Key**: `SMTP_PASS`
  - **Value**: `xxxx xxxx xxxx xxxx`（您的 Gmail 應用程式密碼）

#### 可選設定（Gmail 別名）：
- **Key**: `SMTP_FROM`
  - **Value**: `your-email+system@gmail.com`（別名地址）

- **Key**: `SMTP_FROM_NAME`（進階）
  - **Value**: `叫料系統`（顯示名稱）

### 4. 儲存設定

點擊 **Save Changes**，Render 會自動重新部署服務。

## 💡 範例設定

### 範例 1：基本別名

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=john.doe@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=john.doe+system@gmail.com
```

### 範例 2：帶顯示名稱

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=john.doe@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=john.doe+system@gmail.com
SMTP_FROM_NAME=材料申購系統
```

郵件會顯示為：
```
材料申購系統 <john.doe+system@gmail.com>
```

### 範例 3：不使用別名

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=john.doe@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
# SMTP_FROM 不設定
# SMTP_FROM_NAME 不設定
```

郵件會顯示為：
```
john.doe@gmail.com
```

## 🔍 在 Gmail 中設定過濾器（可選）

使用別名後，您可以在 Gmail 中設定過濾器自動分類郵件：

### 步驟：

1. 登入 Gmail
2. 點擊右上角的「設定」⚙️
3. 選擇「查看所有設定」
4. 點擊「篩選器和封鎖的地址」標籤
5. 點擊「建立新的篩選器」
6. 在「收件者」欄位輸入：`your-email+system@gmail.com`
7. 點擊「建立篩選器」
8. 選擇動作：
   - 套用標籤：例如「系統郵件」
   - 標記為重要
   - 自動歸檔等

## ⚠️ 注意事項

### 1. 別名格式限制

- ✅ 正確：`your-email+system@gmail.com`
- ✅ 正確：`your-email+123@gmail.com`
- ❌ 錯誤：`your-email+system@other-domain.com`（域名必須相同）
- ❌ 錯誤：`other-email@gmail.com`（必須與 SMTP_USER 相同域名）

### 2. SMTP_USER 必須是主地址

- `SMTP_USER` 必須是您的主 Gmail 地址（不帶別名）
- `SMTP_FROM` 可以是別名

例如：
```env
SMTP_USER=your-email@gmail.com          ✅ 正確
SMTP_FROM=your-email+system@gmail.com   ✅ 正確
```

### 3. 別名中的特殊字符

- 別名部分（`+` 後面的部分）可以使用字母、數字和部分特殊字符
- 不支援的特殊字符會自動被忽略

## 🧪 測試設定

設定完成後，測試郵件發送：

1. 建立一個新的叫料單
2. 系統會自動發送郵件
3. 檢查收件箱：
   - 確認郵件已送達
   - 確認發送者地址是別名
   - 確認顯示名稱正確（如果設定了）

## 📚 相關環境變數說明

| 環境變數 | 必填 | 說明 | 範例 |
|---------|------|------|------|
| `SMTP_USER` | ✅ 是 | Gmail 主地址（不帶別名） | `your-email@gmail.com` |
| `SMTP_FROM` | ❌ 否 | 發送者地址（可以是別名） | `your-email+system@gmail.com` |
| `SMTP_FROM_NAME` | ❌ 否 | 發送者顯示名稱 | `叫料系統` |

## 🔗 相關文件

- [SMTP_FROM設定說明.md](./SMTP_FROM設定說明.md)
- [Gmail應用程式密碼設定指南.md](./Gmail應用程式密碼設定指南.md)

## ✅ 快速檢查清單

- [ ] `SMTP_USER` 已設定為您的 Gmail 主地址
- [ ] `SMTP_FROM` 已設定為別名格式（可選）
- [ ] `SMTP_FROM_NAME` 已設定顯示名稱（可選）
- [ ] 所有環境變數已在 Render 上正確設定
- [ ] 已測試郵件發送功能

---

**總結**：Gmail 別名是管理系統郵件的好方法，設定簡單且不需要額外費用！

