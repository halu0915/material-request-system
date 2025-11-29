#!/bin/bash
# 直接推送程式碼到 GitHub

GITHUB_USER="halu0915"
REPO_NAME="material-request-system"
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "🚀 推送程式碼到 GitHub"
echo "===================="
echo ""
echo "帳號: $GITHUB_USER"
echo "儲存庫: $REPO_NAME"
echo "URL: $REPO_URL"
echo ""

# 確保 remote 設定正確
if git remote | grep -q "^origin$"; then
    CURRENT_URL=$(git remote get-url origin)
    if [ "$CURRENT_URL" != "$REPO_URL" ]; then
        echo "🔄 更新 remote URL..."
        git remote set-url origin "$REPO_URL"
    else
        echo "✅ Remote 已正確設定"
    fi
else
    echo "➕ 新增 remote origin..."
    git remote add origin "$REPO_URL"
fi

echo ""
echo "📤 正在推送到 GitHub..."
echo ""

# 推送程式碼
git push -u origin main

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║        ✅ 成功推送到 GitHub！                        ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo ""
    echo "🔗 儲存庫網址: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    
    # 開啟儲存庫頁面
    if command -v open &> /dev/null; then
        open "https://github.com/$GITHUB_USER/$REPO_NAME"
    fi
    
    echo "🎉 完成！"
    echo ""
    echo "📝 下一步：參考 QUICK_DEPLOY.md 部署到 Render"
    echo ""
elif [ $EXIT_CODE -eq 128 ]; then
    echo ""
    echo "⚠️  儲存庫可能尚未建立或需要認證"
    echo ""
    echo "請先完成以下步驟："
    echo ""
    echo "1️⃣  建立 GitHub 儲存庫："
    echo "   前往: https://github.com/new"
    echo "   儲存庫名稱: $REPO_NAME"
    echo "   ⚠️  不要勾選任何初始化選項"
    echo ""
    echo "2️⃣  如果需要認證，請設定："
    echo ""
    echo "   方法 A - Personal Access Token:"
    echo "   1. 前往: https://github.com/settings/tokens/new"
    echo "   2. 產生 token，勾選 'repo' 權限"
    echo "   3. 推送時使用 token 作為密碼"
    echo ""
    echo "   方法 B - 使用 SSH:"
    echo "   git remote set-url origin git@github.com:$GITHUB_USER/$REPO_NAME.git"
    echo "   git push -u origin main"
    echo ""
else
    echo ""
    echo "❌ 推送失敗 (錯誤代碼: $EXIT_CODE)"
    echo ""
    echo "請檢查："
    echo "  • 網路連接"
    echo "  • GitHub 認證設定"
    echo "  • 儲存庫是否存在"
    echo ""
fi

