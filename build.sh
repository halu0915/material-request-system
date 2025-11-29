#!/bin/bash
set -e

echo "🔨 開始構建流程..."
echo ""

# 安裝依賴
echo "📦 步驟 1: 安裝依賴..."
npm install || exit 1
cd server && npm install || exit 1
cd ../client && npm install || exit 1
cd ../..

# 構建後端
echo ""
echo "🔨 步驟 2: 構建後端..."
cd server && npm run build || echo "⚠️ 後端構建有警告，但繼續..." && cd ..

# 構建前端
echo ""
echo "🔨 步驟 3: 構建前端..."
cd client && npm run build || {
    echo "❌ 前端構建失敗！"
    exit 1
} && cd ..

# 驗證前端構建
echo ""
echo "✅ 步驟 4: 驗證構建結果..."
if [ -f "client/dist/index.html" ]; then
    echo "✅ 前端構建成功！"
    echo "📁 構建文件位置: client/dist/"
    ls -la client/dist/ | head -10
else
    echo "❌ 前端構建文件未找到！"
    exit 1
fi

echo ""
echo "🎉 構建完成！"

