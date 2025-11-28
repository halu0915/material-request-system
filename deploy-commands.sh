#!/bin/bash
# 部署指令腳本
# 使用方法: ./deploy-commands.sh

echo "🚀 叫料系統部署指令"
echo "===================="
echo ""

# 檢查 Git 是否已初始化
if [ ! -d ".git" ]; then
    echo "❌ Git 未初始化，正在初始化..."
    git init
    git branch -M main
fi

# 顯示當前狀態
echo "📊 Git 狀態："
git status --short
echo ""

# 提示步驟
echo "📝 部署步驟："
echo ""
echo "1️⃣  確保所有檔案已準備好"
read -p "   是否已檢查所有檔案？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   請先執行 ./pre-deploy.sh 檢查檔案"
    exit 1
fi

echo ""
echo "2️⃣  在 GitHub 建立新儲存庫"
echo "   前往: https://github.com/new"
echo "   建立一個新的儲存庫（不要初始化 README）"
echo ""
read -p "   已建立 GitHub 儲存庫？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   請先建立 GitHub 儲存庫"
    exit 1
fi

echo ""
echo "3️⃣  連接 GitHub 儲存庫"
read -p "   請輸入您的 GitHub 儲存庫 URL (例如: https://github.com/username/repo.git): " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ 未輸入儲存庫 URL"
    exit 1
fi

# 檢查是否已有 remote
if git remote | grep -q "^origin$"; then
    echo "⚠️  已存在 origin remote，正在更新..."
    git remote set-url origin "$repo_url"
else
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "4️⃣  建立初始提交"
read -p "   是否要現在提交所有檔案？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add .
    git commit -m "Initial commit: 叫料系統 - Material Request System"
    echo "✅ 已建立提交"
fi

echo ""
echo "5️⃣  推送到 GitHub"
read -p "   是否要推送到 GitHub？(y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   正在推送..."
    git push -u origin main
    if [ $? -eq 0 ]; then
        echo "✅ 已成功推送到 GitHub！"
    else
        echo "❌ 推送失敗，請檢查錯誤訊息"
        exit 1
    fi
fi

echo ""
echo "6️⃣  部署到 Render"
echo ""
echo "   接下來請前往 Render Dashboard:"
echo "   https://dashboard.render.com"
echo ""
echo "   步驟："
echo "   1. 點選 'New +' → 'Web Service'"
echo "   2. 連接您的 GitHub 儲存庫"
echo "   3. 設定以下參數："
echo "      - Name: material-request-system"
echo "      - Environment: Node"
echo "      - Build Command: npm run install:all && npm run build"
echo "      - Start Command: cd server && npm start"
echo "   4. 建立 PostgreSQL 資料庫"
echo "   5. 設定環境變數（參考 DEPLOY.md）"
echo ""
echo "   詳細說明請參考: DEPLOY.md"
echo ""
echo "✅ 本地部署準備完成！"

