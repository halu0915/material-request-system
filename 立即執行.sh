#!/bin/bash
# 立即建立並推送儲存庫

echo "🚀 建立並推送 GitHub 儲存庫"
echo "============================"
echo ""

# 開啟 GitHub 建立頁面
echo "📝 步驟 1: 正在開啟 GitHub 建立頁面..."
if command -v open &> /dev/null; then
    open "https://github.com/new"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://github.com/new"
else
    echo "   請手動前往: https://github.com/new"
fi

echo ""
echo "   請在瀏覽器中："
echo "   1. 輸入儲存庫名稱: material-request-system"
echo "   2. 選擇 Private 或 Public"
echo "   3. ⚠️  不要勾選任何初始化選項"
echo "   4. 點選「Create repository」"
echo ""

read -p "   已完成建立儲存庫？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   請先完成建立儲存庫，然後重新執行此腳本"
    exit 1
fi

echo ""
echo "📋 步驟 2: 請輸入您的 GitHub 儲存庫 URL"
echo "   範例: https://github.com/您的帳號/material-request-system.git"
echo ""
read -p "   儲存庫 URL: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ 未輸入 URL"
    exit 1
fi

# 檢查是否已有 origin
if git remote | grep -q "^origin$"; then
    echo ""
    echo "⚠️  已存在 origin，正在更新..."
    git remote set-url origin "$repo_url"
else
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 步驟 3: 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║              ✅ 成功推送到 GitHub！                  ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo ""
    
    # 顯示儲存庫 URL
    repo_web_url=$(echo "$repo_url" | sed 's/\.git$//' | sed 's/git@github.com:/https:\/\/github.com\//')
    echo "🔗 儲存庫網址: $repo_web_url"
    echo ""
    
    # 開啟儲存庫頁面
    if command -v open &> /dev/null; then
        echo "   正在開啟儲存庫頁面..."
        open "$repo_web_url"
    fi
    
    echo ""
    echo "🎉 下一步："
    echo "   參考 QUICK_DEPLOY.md 部署到 Render"
    echo ""
else
    echo ""
    echo "❌ 推送失敗"
    echo ""
    echo "可能的原因："
    echo "  • 儲存庫 URL 錯誤"
    echo "  • 未授權訪問（需要 Personal Access Token 或 SSH key）"
    echo "  • 網路連接問題"
    echo ""
    echo "請參考「建立儲存庫指南.md」了解如何設定認證"
    exit 1
fi

