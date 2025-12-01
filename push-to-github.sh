#!/bin/bash
# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi


# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi

# 推送到 GitHub 腳本

echo "📤 推送程式碼到 GitHub"
echo "===================="
echo ""

# 檢查是否有 remote
if git remote | grep -q "^origin$"; then
    echo "✅ 已存在 origin remote"
    git remote -v
    echo ""
    read -p "是否使用現有的 origin？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        use_existing=0
    else
        use_existing=1
    fi
else
    use_existing=0
fi

if [ $use_existing -eq 0 ]; then
    echo ""
    echo "請輸入您的 GitHub 儲存庫 URL："
    echo "範例格式："
    echo "  https://github.com/username/repo-name.git"
    echo "  或"
    echo "  git@github.com:username/repo-name.git"
    echo ""
    read -p "儲存庫 URL: " repo_url
    
    if [ -z "$repo_url" ]; then
        echo "❌ 未輸入儲存庫 URL"
        exit 1
    fi
    
    echo ""
    echo "➕ 新增 remote origin..."
    git remote add origin "$repo_url"
fi

echo ""
echo "📤 正在推送程式碼到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    # 嘗試取得儲存庫 URL
    repo_url=$(git remote get-url origin)
    if [[ $repo_url == *"github.com"* ]]; then
        # 轉換為 HTTPS URL
        if [[ $repo_url == git@* ]]; then
            repo_url=$(echo "$repo_url" | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        else
            repo_url=$(echo "$repo_url" | sed 's/\.git$//')
        fi
        echo "🔗 儲存庫網址: $repo_url"
    fi
    echo ""
    echo "🎉 下一步："
    echo "   1. 前往 Render Dashboard 建立服務"
    echo "   2. 參考 QUICK_DEPLOY.md 完成部署"
else
    echo ""
    echo "❌ 推送失敗"
    echo "請檢查："
    echo "  - GitHub 儲存庫是否已建立"
    echo "  - 儲存庫 URL 是否正確"
    echo "  - 是否已登入 GitHub"
    exit 1
fi




