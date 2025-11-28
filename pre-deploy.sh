#!/bin/bash
# 部署前檢查腳本

echo "🔍 檢查部署準備狀況..."
echo ""

# 檢查必要檔案
echo "📁 檢查必要檔案..."
files=(
  "package.json"
  "server/package.json"
  "client/package.json"
  "server/src/index.ts"
  "client/src/main.tsx"
  "README.md"
  ".gitignore"
)

missing_files=0
for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ 缺少檔案: $file"
    missing_files=$((missing_files + 1))
  else
    echo "✅ $file"
  fi
done

if [ $missing_files -gt 0 ]; then
  echo ""
  echo "⚠️  發現 $missing_files 個缺失檔案，請檢查後再部署"
  exit 1
fi

echo ""
echo "📦 檢查環境變數設定..."
if [ ! -f ".env" ]; then
  echo "⚠️  未發現 .env 檔案（這是正常的，環境變數應在 Render 設定）"
else
  echo "✅ 發現 .env 檔案（請確認不要提交敏感資訊）"
fi

echo ""
echo "✅ 基本檢查完成！"
echo ""
echo "📝 下一步："
echo "1. 在 GitHub 建立新的儲存庫"
echo "2. 執行: git remote add origin <您的GitHub儲存庫URL>"
echo "3. 執行: git commit -m 'Initial commit'"
echo "4. 執行: git push -u origin main"
echo "5. 在 Render 建立服務並連接 GitHub 儲存庫"
echo ""
echo "詳細說明請參考 DEPLOY.md"

