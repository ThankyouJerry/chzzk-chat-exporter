# GitHub 업로드 가이드

## 🚀 빠른 시작

### 1. Git 초기화 및 커밋

```bash
cd /Users/hvs/.gemini/antigravity/scratch/chzzk-chat-exporter

# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Chzzk Chat Exporter v1.0.0"
```

### 2. GitHub 저장소 생성

1. https://github.com 접속
2. 로그인
3. 우측 상단 **+** 버튼 클릭
4. **New repository** 선택
5. 저장소 정보 입력:
   - **Repository name**: `chzzk-chat-exporter`
   - **Description**: `치지직 방송 채팅을 CSV로 내보내는 Chrome 확장프로그램`
   - **Public** 선택 (또는 Private)
   - **Add a README file**: 체크 해제 (이미 있음)
   - **Add .gitignore**: None
   - **Choose a license**: MIT License (권장)
6. **Create repository** 클릭

### 3. 로컬 저장소와 GitHub 연결

GitHub에서 생성된 저장소 페이지에 나오는 명령어 사용:

```bash
# GitHub 저장소와 연결 (username을 본인 것으로 변경)
git remote add origin https://github.com/[username]/chzzk-chat-exporter.git

# 기본 브랜치 이름 설정
git branch -M main

# 푸시
git push -u origin main
```

---

## 📝 상세 가이드

### Step 1: Git 설정 확인

```bash
# Git 사용자 정보 확인
git config --global user.name
git config --global user.email

# 설정되어 있지 않다면 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 2: .gitignore 확인

이미 `.gitignore` 파일이 있으므로 확인:

```bash
cat .gitignore
```

다음 항목들이 포함되어 있어야 합니다:
- `.DS_Store`
- `*.zip` (제출용 ZIP은 제외)
- `screenshots/` (스크린샷은 나중에 추가)
- `node_modules/`

### Step 3: 첫 커밋

```bash
# 현재 상태 확인
git status

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Chzzk Chat Exporter v1.0.0

Features:
- URL input from any page
- Time range selection (start/end)
- Auto CSV download
- 20MB file splitting
- API-based chat collection"
```

### Step 4: GitHub에 푸시

```bash
# 원격 저장소 추가 (username 변경 필요)
git remote add origin https://github.com/[username]/chzzk-chat-exporter.git

# 푸시
git push -u origin main
```

---

## 🔐 인증 방법

### Option 1: Personal Access Token (권장)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Generate new token** 클릭
3. 권한 선택:
   - `repo` (전체 체크)
4. **Generate token** 클릭
5. 토큰 복사 (한 번만 보임!)
6. Git 푸시 시 비밀번호 대신 토큰 입력

### Option 2: SSH Key

```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your.email@example.com"

# 공개 키 복사
cat ~/.ssh/id_ed25519.pub

# GitHub → Settings → SSH and GPG keys → New SSH key
# 복사한 공개 키 붙여넣기

# SSH URL로 원격 저장소 추가
git remote add origin git@github.com:[username]/chzzk-chat-exporter.git
```

---

## 📋 업로드 후 할 일

### 1. README 업데이트

GitHub 저장소 URL을 README에 추가:

```bash
# README.md 수정
# 예: GitHub 링크, 설치 방법 등
```

### 2. Release 생성

1. GitHub 저장소 → **Releases** → **Create a new release**
2. Tag version: `v1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description:
   ```markdown
   ## 🎉 첫 번째 릴리스!
   
   ### 주요 기능
   - 어느 페이지에서든 URL 입력으로 사용 가능
   - 시작/종료 시간 범위 설정
   - 자동 CSV 다운로드
   - 20MB 초과 시 자동 파일 분할
   
   ### 설치 방법
   [INSTALLATION.md](INSTALLATION.md) 참조
   ```
5. **Attach binaries**: `chzzk-chat-exporter-v1.0.0.zip` 업로드
6. **Publish release** 클릭

### 3. GitHub Pages 설정 (개인정보처리방침 호스팅)

1. GitHub 저장소 → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → **/ (root)** → **Save**
4. 몇 분 후 `https://[username].github.io/chzzk-chat-exporter/` 접속 가능
5. 개인정보처리방침 URL로 사용

---

## 🎯 완료 체크리스트

- [ ] Git 초기화 및 첫 커밋
- [ ] GitHub 저장소 생성
- [ ] 로컬과 GitHub 연결
- [ ] 푸시 완료
- [ ] Release 생성 및 ZIP 파일 업로드
- [ ] GitHub Pages 설정 (선택)
- [ ] README에 GitHub 링크 추가
- [ ] Chrome Web Store 제출 시 개인정보처리방침 URL 업데이트

---

## 💡 유용한 Git 명령어

```bash
# 상태 확인
git status

# 변경사항 확인
git diff

# 커밋 히스토리
git log --oneline

# 새 브랜치 생성
git checkout -b feature/new-feature

# 변경사항 푸시
git add .
git commit -m "Update: description"
git push

# 원격 저장소 확인
git remote -v
```

---

## 🚨 주의사항

### 업로드하면 안 되는 것들

- ✅ `.gitignore`에 이미 설정됨:
  - `.DS_Store`
  - `node_modules/`
  - 개인 설정 파일
  - 빌드 아티팩트

### 업로드해야 하는 것들

- ✅ 소스 코드 (`.js`, `.html`, `.css`, `.json`)
- ✅ 아이콘 (`icons/`)
- ✅ 문서 (`.md` 파일들)
- ✅ `.gitignore`
- ⚠️ ZIP 파일은 Release에만 업로드 (저장소에는 제외)

---

## 📞 도움말

### 푸시 실패 시

```bash
# 원격 저장소 확인
git remote -v

# 원격 저장소 제거 후 다시 추가
git remote remove origin
git remote add origin https://github.com/[username]/chzzk-chat-exporter.git

# 강제 푸시 (주의!)
git push -f origin main
```

### 커밋 메시지 수정

```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "New commit message"

# 푸시 (이미 푸시했다면 강제 푸시 필요)
git push -f origin main
```

---

**준비 완료!** 위 명령어들을 순서대로 실행하면 GitHub에 업로드됩니다! 🚀
