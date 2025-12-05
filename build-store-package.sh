#!/bin/bash

# Chrome Web Store 제출용 ZIP 파일 생성 스크립트

echo "🎯 치지직 채팅 내보내기 - Chrome Web Store 제출용 ZIP 생성"
echo ""

# 현재 디렉토리 확인
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 버전 정보 추출
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
echo "📦 버전: $VERSION"
echo ""

# ZIP 파일명
ZIP_NAME="chzzk-chat-exporter-v${VERSION}.zip"

# 기존 ZIP 파일 삭제
if [ -f "$ZIP_NAME" ]; then
    echo "🗑️  기존 ZIP 파일 삭제: $ZIP_NAME"
    rm "$ZIP_NAME"
fi

echo "📁 포함할 파일:"
echo "  ✓ manifest.json"
echo "  ✓ popup.html, popup.css, popup.js"
echo "  ✓ content.js"
echo "  ✓ background.js"
echo "  ✓ icons/"
echo ""

echo "🚫 제외할 파일:"
echo "  ✗ *.md (문서 파일)"
echo "  ✗ test-page.html"
echo "  ✗ .DS_Store"
echo "  ✗ screenshots/"
echo ""

# ZIP 파일 생성
echo "📦 ZIP 파일 생성 중..."
zip -r "$ZIP_NAME" \
  manifest.json \
  popup.html \
  popup.css \
  popup.js \
  content.js \
  background.js \
  icons/ \
  -x "*.DS_Store" \
  -x "__MACOSX" \
  -x "*.md" \
  -x "test-page.html" \
  -x "screenshots/*" \
  -x ".*"

echo ""
echo "✅ ZIP 파일 생성 완료!"
echo ""
echo "📄 파일명: $ZIP_NAME"
echo "📊 파일 크기: $(du -h "$ZIP_NAME" | cut -f1)"
echo ""

# ZIP 내용 확인
echo "📋 ZIP 파일 내용:"
unzip -l "$ZIP_NAME"
echo ""

echo "🎉 완료!"
echo ""
echo "다음 단계:"
echo "1. Chrome Web Store 개발자 대시보드 접속"
echo "   https://chrome.google.com/webstore/devconsole"
echo ""
echo "2. '새 항목' 클릭 후 $ZIP_NAME 업로드"
echo ""
echo "3. STORE_LISTING.md 파일을 참고하여 스토어 정보 입력"
echo ""
echo "4. CHROME_STORE_SUBMISSION.md 파일을 참고하여 권한 정당화 입력"
echo ""
echo "5. 스크린샷 업로드 (SCREENSHOT_GUIDE.md 참조)"
echo ""
echo "6. '검토를 위해 제출' 클릭"
echo ""
