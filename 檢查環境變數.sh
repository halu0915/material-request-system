#!/bin/bash
# 檢查環境變數設定的腳本

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🔍 環境變數設定檢查清單                            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 請在 Render Dashboard 確認以下環境變數已設定："
echo ""

# 必要環境變數
echo "🔴 必要環境變數（必須設定）："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. NODE_ENV"
echo "   ✓ 值應為: production"
echo ""
echo "2. PORT"
echo "   ✓ 值應為: 5000"
echo ""
echo "3. DATABASE_URL"
echo "   ✓ 值應為: postgresql://... (從PostgreSQL複製的Internal URL)"
echo "   ⚠️  必須使用 Internal Database URL"
echo ""
echo "4. JWT_SECRET"
echo "   ✓ 值應為: OkcpmA5cA9AfyLiGbK0nIelObvmiRPopuKryFW2N/io="
echo ""
echo "5. FRONTEND_URL"
echo "   ✓ 值應為: https://material-request-system.onrender.com"
echo "   ⚠️  部署完成後請更新為實際的服務 URL"
echo ""

# 建議環境變數
echo "🟡 建議設定的環境變數："
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "6. TRIAL_EMAIL"
echo "   ✓ 建議值: trial@material-request.com"
echo ""
echo "7. TRIAL_PASSWORD"
echo "   ✓ 建議值: trial123456"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "📍 設定位置"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Render Dashboard → material-request-system → Environment"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "📝 快速參考"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "• 詳細指南: cat 環境變數設定指南.md"
echo "• 快速設定: cat 環境變數快速設定.txt"
echo ""

read -p "是否開啟 Render Dashboard 進行設定？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🌐 正在開啟 Render Dashboard..."
    open "https://dashboard.render.com" 2>/dev/null || echo "請手動前往: https://dashboard.render.com"
    echo ""
    echo "✅ 請在 Dashboard 中："
    echo "   1. 選擇 Web Service: material-request-system"
    echo "   2. 點選左側「Environment」頁籤"
    echo "   3. 新增上述環境變數"
    echo ""
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ 檢查完成！"
echo "═══════════════════════════════════════════════════════════════"
echo ""

