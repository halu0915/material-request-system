#!/bin/bash
# 使用 GitHub API 建立儲存庫（需要 Personal Access Token）

REPO_NAME="material-request-system"
GITHUB_USER="halu0915"
REPO_DESC="叫料系統 - Material Request System"

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""
echo "帳號: $GITHUB_USER"
echo "儲存庫名稱: $REPO_NAME"
echo ""

# 檢查是否有 token
if [ -z "$GITHUB_TOKEN" ]; then
    echo "📝 需要 GitHub Personal Access Token"
    echo ""
    echo "請先建立 Token："
    echo "1. 前往: https://github.com/settings/tokens/new"
    echo "2. Token 名稱: material-request-deploy"
    echo "3. 勾選權限: repo (所有 repo 權限)"
    echo "4. 點選「Generate token」"
    echo "5. 複製 token（只會顯示一次）"
    echo ""
    read -sp "請貼上您的 GitHub Personal Access Token: " GITHUB_TOKEN
    echo ""
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo "❌ 未輸入 Token"
        exit 1
    fi
fi

echo ""
echo "🔨 正在建立儲存庫..."
echo ""

# 使用 GitHub API 建立儲存庫
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"$REPO_DESC\",
    \"private\": false,
    \"auto_init\": false
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ 儲存庫建立成功！"
    echo ""
    
    # 設定 remote
    if git remote | grep -q "^origin$"; then
        echo "🔄 更新 remote origin..."
        git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    else
        echo "➕ 新增 remote origin..."
        git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    fi
    
    echo ""
    echo "📤 正在推送程式碼..."
    echo ""
    
    # 推送程式碼
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "╔══════════════════════════════════════════════════════╗"
        echo "║        ✅ 成功建立並推送儲存庫！                    ║"
        echo "╚══════════════════════════════════════════════════════╝"
        echo ""
        echo "🔗 儲存庫網址: https://github.com/$GITHUB_USER/$REPO_NAME"
        echo ""
        echo "🎉 下一步："
        echo "   參考 QUICK_DEPLOY.md 部署到 Render"
        echo ""
    else
        echo ""
        echo "❌ 推送失敗"
        echo "儲存庫已建立，但推送失敗。請手動執行："
        echo "  git push -u origin main"
        echo ""
        echo "或檢查網路連接和認證設定"
    fi
elif [ "$HTTP_CODE" = "422" ]; then
    echo "⚠️  儲存庫可能已存在，嘗試連接現有儲存庫..."
    
    # 設定 remote
    if git remote | grep -q "^origin$"; then
        git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    else
        git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    fi
    
    echo ""
    echo "📤 正在推送程式碼..."
    git push -u origin main
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ 認證失敗"
    echo "Token 無效或已過期，請重新產生 Token"
elif [ "$HTTP_CODE" = "403" ]; then
    echo "❌ 權限不足"
    echo "請確認 Token 有 repo 權限"
else
    echo "❌ 建立失敗 (HTTP $HTTP_CODE)"
    echo "回應: $BODY"
fi

