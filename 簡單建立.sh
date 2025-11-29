#!/bin/bash
# 簡化版：先設定好 remote，然後提示用戶手動建立

GITHUB_USER="halu0915"
REPO_NAME="material-request-system"
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "🚀 準備建立 GitHub 儲存庫"
echo "===================="
echo ""
echo "帳號: $GITHUB_USER"
echo "儲存庫名稱: $REPO_NAME"
echo ""

# 設定 remote
if git remote | grep -q "^origin$"; then
    echo "🔄 更新 remote origin..."
    git remote set-url origin "$REPO_URL"
else
    echo "➕ 新增 remote origin..."
    git remote add origin "$REPO_URL"
fi

echo ""
echo "✅ Remote 已設定: $REPO_URL"
echo ""

# 開啟 GitHub 建立頁面
echo "📝 步驟 1: 正在開啟 GitHub 建立頁面..."
if command -v open &> /dev/null; then
    open "https://github.com/new"
else
    echo "   請手動前往: https://github.com/new"
fi

echo ""
echo "   請在瀏覽器中："
echo "   1. Repository name: $REPO_NAME"
echo "   2. Description: 叫料系統 - Material Request System"
echo "   3. 選擇 Private 或 Public"
echo "   4. ⚠️  不要勾選任何初始化選項"
echo "   5. 點選「Create repository」"
echo ""

read -p "   已完成建立儲存庫？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "   請先完成建立儲存庫"
    echo "   建立完成後，執行以下指令推送："
    echo "   git push -u origin main"
    exit 0
fi

echo ""
echo "📤 步驟 2: 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
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
    
    echo "🎉 下一步："
    echo "   參考 QUICK_DEPLOY.md 部署到 Render"
    echo ""
else
    echo ""
    echo "❌ 推送失敗"
    echo ""
    echo "可能的原因："
    echo "  • 儲存庫尚未建立，請先在 GitHub 建立"
    echo "  • 需要認證（Personal Access Token 或 SSH key）"
    echo ""
    echo "如果儲存庫已建立，但推送失敗，可能需要設定認證："
    echo ""
    echo "方法 1: 使用 Personal Access Token"
    echo "  1. 前往: https://github.com/settings/tokens/new"
    echo "  2. 產生 token，勾選 'repo' 權限"
    echo "  3. 使用 token 作為密碼推送"
    echo ""
    echo "方法 2: 使用 SSH"
    echo "  git remote set-url origin git@github.com:$GITHUB_USER/$REPO_NAME.git"
    echo "  git push -u origin main"
    echo ""
fi

