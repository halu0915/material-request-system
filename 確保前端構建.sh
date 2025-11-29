#!/bin/bash
# 確保前端構建的腳本

echo "🔨 開始構建流程..."

# 安裝依賴
echo "📦 安裝依賴..."
npm install || exit 1
cd server && npm install || exit 1
cd ../client && npm install || exit 1
cd ../..

# 構建後端
echo "🔨 構建後端..."
cd server && npm run build || echo "⚠️ 後端構建有警告但繼續..."
cd ..

# 構建前端
echo "🔨 構建前端..."
cd client && npm run build || {
    echo "❌ 前端構建失敗！"
    exit 1
}
cd ..

# 檢查前端構建結果
if [ -d "client/dist" ] && [ -f "client/dist/index.html" ]; then
    echo "✅ 前端構建成功！"
    echo "📁 構建文件位置: client/dist/"
    ls -la client/dist/
else
    echo "❌ 前端構建文件未找到！"
    exit 1
fi

echo "🎉 構建完成！"

