#!/bin/bash
# 前端構建腳本 - 確保前端一定會構建

set -e  # 遇到錯誤就停止

echo "🚀 開始前端構建流程..."

# 進入 client 目錄
cd client

echo "📦 安裝前端依賴..."
npm install

echo "🔨 構建前端..."
npm run build

echo "✅ 檢查構建結果..."
if [ -f "dist/index.html" ]; then
    echo "✅ ✅ ✅ 前端構建成功！"
    echo "📁 構建文件位置: $(pwd)/dist"
    ls -la dist/
    echo "📋 文件列表:"
    find dist -type f | head -10
else
    echo "❌ ❌ ❌ 前端構建失敗！找不到 dist/index.html"
    exit 1
fi

cd ..

echo "🎉 前端構建完成！"

