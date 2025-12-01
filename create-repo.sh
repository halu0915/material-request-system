#!/bin/bash
# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi


# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi

# 建立 GitHub 儲存庫腳本

echo "🚀 建立 GitHub 儲存庫"
echo "===================="
echo ""

# 檢查是否已登入 GitHub CLI
if command -v gh &> /dev/null; then
    echo "✅ 發現 GitHub CLI"
    
    read -p "儲存庫名稱 (預設: material-request-system): " repo_name
    repo_name=${repo_name:-material-request-system}
    
    read -p "儲存庫描述 (預設: 叫料系統 - Material Request System): " repo_desc
    repo_desc=${repo_desc:-叫料系統 - Material Request System}
    
    read -p "是否設為公開儲存庫? (y/n, 預設: n): " is_public
    if [[ $is_public =~ ^[Yy]$ ]]; then
        visibility="--public"
    else
        visibility="--private"
    fi
    
    echo ""
    echo "正在建立儲存庫..."
    gh repo create "$repo_name" --description "$repo_desc" $visibility --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 儲存庫建立成功！"
        echo "📦 程式碼已推送到 GitHub"
        echo "🔗 儲存庫網址: https://github.com/$(gh api user --jq .login)/$repo_name"
    else
        echo "❌ 建立儲存庫失敗"
        exit 1
    fi
else
    echo "⚠️  未安裝 GitHub CLI"
    echo ""
    echo "請選擇以下方式之一："
    echo ""
    echo "【方法 1】安裝 GitHub CLI（推薦）"
    echo "  macOS: brew install gh"
    echo "  然後執行: gh auth login"
    echo "  再重新執行此腳本"
    echo ""
    echo "【方法 2】手動建立"
    echo "  1. 前往 https://github.com/new"
    echo "  2. 輸入儲存庫名稱: material-request-system"
    echo "  3. 選擇公開或私人"
    echo "  4. **不要**勾選「Initialize this repository」"
    echo "  5. 點選「Create repository」"
    echo "  6. 複製儲存庫 URL，然後執行以下指令："
    echo ""
    echo "     git remote add origin <您的儲存庫URL>"
    echo "     git push -u origin main"
    echo ""
    echo "  或執行: ./push-to-github.sh"
    exit 1
fi




