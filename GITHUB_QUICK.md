# GitHub 업로드 - 빠른 가이드

## 🚀 자동 스크립트 사용 (권장)

```bash
cd /Users/hvs/.gemini/antigravity/scratch/chzzk-chat-exporter
./upload-to-github.sh
```

스크립트가 다음을 자동으로 처리합니다:
1. Git 사용자 정보 설정
2. Git 초기화
3. 파일 추가 및 커밋
4. GitHub 저장소 연결
5. 푸시

---

## 📝 수동으로 하기

### 1. Git 설정
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### 2. Git 초기화 및 커밋
```bash
git init
git add .
git commit -m "Initial commit: Chzzk Chat Exporter v1.0.0"
```

### 3. GitHub에서 저장소 생성
1. https://github.com 접속
2. **+** → **New repository**
3. 이름: `chzzk-chat-exporter`
4. **Create repository**

### 4. 푸시
```bash
# username을 본인 것으로 변경
git remote add origin https://github.com/[username]/chzzk-chat-exporter.git
git branch -M main
git push -u origin main
```

---

## 🔐 인증

### Personal Access Token 생성
1. https://github.com/settings/tokens
2. **Generate new token (classic)**
3. `repo` 권한 선택
4. 토큰 생성 및 복사
5. Git 푸시 시 비밀번호 대신 토큰 입력

---

## ✅ 완료 후

### 1. Release 생성
- https://github.com/[username]/chzzk-chat-exporter/releases/new
- Tag: `v1.0.0`
- ZIP 파일 업로드

### 2. GitHub Pages 설정
- Settings → Pages
- Source: main branch
- 개인정보처리방침 URL로 사용

---

**준비 완료!** `./upload-to-github.sh` 실행하세요! 🎉
