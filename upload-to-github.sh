#!/bin/bash

# GitHub 업로드 자동화 스크립트

echo "🚀 GitHub 업로드 준비 중..."
echo ""

# 1. Git 사용자 정보 확인
echo "📝 Step 1: Git 사용자 정보 설정"
echo "현재 Git 사용자 정보:"
git config --global user.name 2>/dev/null || echo "  (설정되지 않음)"
git config --global user.email 2>/dev/null || echo "  (설정되지 않음)"
echo ""

read -p "Git 사용자 이름을 입력하세요: " git_name
read -p "Git 이메일을 입력하세요: " git_email

git config --global user.name "$git_name"
git config --global user.email "$git_email"

echo "✅ Git 사용자 정보 설정 완료"
echo ""

# 2. Git 초기화
echo "📦 Step 2: Git 초기화"
if [ -d ".git" ]; then
    echo "⚠️  이미 Git 저장소가 초기화되어 있습니다."
    read -p "다시 초기화하시겠습니까? (y/N): " reinit
    if [ "$reinit" = "y" ] || [ "$reinit" = "Y" ]; then
        rm -rf .git
        git init
        echo "✅ Git 저장소 재초기화 완료"
    fi
else
    git init
    echo "✅ Git 저장소 초기화 완료"
fi
echo ""

# 3. 파일 추가 및 커밋
echo "📝 Step 3: 파일 추가 및 커밋"
git add .
git commit -m "Initial commit: Chzzk Chat Exporter v1.0.0

Features:
- URL input from any page
- Time range selection (start/end)
- Auto CSV download
- 20MB file splitting
- API-based chat collection"

echo "✅ 첫 커밋 완료"
echo ""

# 4. GitHub 저장소 URL 입력
echo "🔗 Step 4: GitHub 저장소 연결"
echo ""
echo "GitHub에서 새 저장소를 생성하세요:"
echo "1. https://github.com 접속"
echo "2. 우측 상단 + 버튼 → New repository"
echo "3. Repository name: chzzk-chat-exporter"
echo "4. Public 선택"
echo "5. Create repository 클릭"
echo ""
read -p "GitHub 사용자명을 입력하세요: " github_username

git remote add origin "https://github.com/$github_username/chzzk-chat-exporter.git"
echo "✅ 원격 저장소 연결 완료"
echo ""

# 5. 브랜치 설정 및 푸시
echo "🚀 Step 5: GitHub에 푸시"
git branch -M main

echo ""
echo "이제 GitHub에 푸시합니다..."
echo "GitHub 비밀번호 또는 Personal Access Token을 입력하세요."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 성공! GitHub에 업로드되었습니다!"
    echo ""
    echo "저장소 URL: https://github.com/$github_username/chzzk-chat-exporter"
    echo ""
    echo "다음 단계:"
    echo "1. Release 생성: https://github.com/$github_username/chzzk-chat-exporter/releases/new"
    echo "2. ZIP 파일 업로드: chzzk-chat-exporter-v1.0.0.zip"
    echo "3. GitHub Pages 설정 (개인정보처리방침 호스팅)"
else
    echo ""
    echo "⚠️  푸시 실패"
    echo ""
    echo "Personal Access Token이 필요할 수 있습니다:"
    echo "1. https://github.com/settings/tokens"
    echo "2. Generate new token (classic)"
    echo "3. repo 권한 선택"
    echo "4. 생성된 토큰을 비밀번호 대신 사용"
fi
