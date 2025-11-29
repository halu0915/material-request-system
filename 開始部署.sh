#!/bin/bash
# 部署到 Render 的協助腳本

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🚀 部署叫料系統到 Render                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 產生 JWT Secret
echo "🔑 產生 JWT Secret..."
JWT_SECRET=$(openssl rand -base64 32)
echo "✅ JWT Secret 已產生"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "📋 部署前準備"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "✅ GitHub 儲存庫: https://github.com/halu0915/material-request-system"
echo ""
echo "🔑 您的 JWT Secret (請複製到 Render 環境變數):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$JWT_SECRET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 請將此 JWT Secret 儲存好，稍後要設定到 Render 環境變數中"
echo ""

read -p "按 Enter 繼續，將開啟 Render Dashboard..." -r
echo ""

# 開啟 Render Dashboard
echo "🌐 正在開啟 Render Dashboard..."
if command -v open &> /dev/null; then
    open "https://dashboard.render.com"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://dashboard.render.com"
else
    echo "   請手動前往: https://dashboard.render.com"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📋 部署步驟"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  建立 PostgreSQL 資料庫"
echo "   • 點選「New +」→「PostgreSQL」"
echo "   • Name: material-request-db"
echo "   • Region: Singapore (或選擇靠近您的區域)"
echo "   • Plan: Free"
echo "   • 建立後複製「Internal Database URL」"
echo ""
echo "2️⃣  建立 Web Service"
echo "   • 點選「New +」→「Web Service」"
echo "   • 連接 GitHub 帳號"
echo "   • 選擇儲存庫: material-request-system"
echo ""
echo "3️⃣  設定服務參數"
echo "   • Name: material-request-system"
echo "   • Build Command: npm run install:all && npm run build"
echo "   • Start Command: cd server && npm start"
echo ""
echo "4️⃣  設定環境變數（在 Environment 頁籤）"
echo ""
echo "   必要變數："
echo "   • NODE_ENV=production"
echo "   • PORT=5000"
echo "   • DATABASE_URL=<從資料庫複製的 Internal URL>"
echo "   • JWT_SECRET=$JWT_SECRET"
echo "   • FRONTEND_URL=https://material-request-system.onrender.com"
echo ""
echo "   可選變數："
echo "   • TRIAL_EMAIL=trial@material-request.com"
echo "   • TRIAL_PASSWORD=trial123456"
echo ""
echo "5️⃣  點選「Create Web Service」開始部署"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

read -p "按 Enter 開啟詳細部署指南..." -r
echo ""

# 顯示詳細指南
if [ -f "部署到Render.md" ]; then
    if command -v open &> /dev/null; then
        open "部署到Render.md"
    elif command -v cat &> /dev/null; then
        echo "詳細指南內容："
        head -50 "部署到Render.md"
    fi
fi

echo ""
echo "📚 詳細指南已儲存到: 部署到Render.md"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ 準備完成！請按照上述步驟在 Render Dashboard 完成部署"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 將 JWT Secret 儲存到檔案（方便查看）
echo "$JWT_SECRET" > .jwt_secret.txt
echo "💾 JWT Secret 已儲存到 .jwt_secret.txt（已加入 .gitignore）"
echo ""

