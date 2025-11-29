#!/bin/bash
# 修復部署錯誤並推送

echo "🔧 修復部署錯誤"
echo "================"
echo ""

echo "1. 檢查修改的檔案..."
git status --short
echo ""

echo "2. 提交修復..."
git add -A
git commit -m "Fix TypeScript compilation errors for deployment

- Update tsconfig.json to fix Node.js type definitions
- Adjust TypeScript strict mode for deployment compatibility
- Fix type definitions issues"

echo ""
echo "3. 推送到 GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 修復已推送到 GitHub！"
    echo ""
    echo "📝 下一步："
    echo "   1. 前往 Render Dashboard"
    echo "   2. 選擇您的 Web Service"
    echo "   3. 點選「Manual Deploy」→「Deploy latest commit」"
    echo "   4. 等待部署完成"
    echo ""
else
    echo ""
    echo "❌ 推送失敗，請檢查錯誤訊息"
fi

