# Chrome Web Store 제출 가이드

## 제출 전 준비사항

### 1. 개발자 등록
- Chrome Web Store 개발자 대시보드: https://chrome.google.com/webstore/devconsole
- Google 계정 필요
- **개발자 등록 비용: $5 (일회성)**

---

## 제출 시 입력해야 할 정보

### 1. 개인정보처리방침 링크 ⚠️ 필수

개인정보처리방침을 온라인에 게시하고 그 URL을 입력해야 합니다.

**옵션 A: GitHub Pages 사용 (무료, 권장)**
1. GitHub 저장소 생성
2. `PRIVACY_POLICY.md` 파일 업로드
3. Settings → Pages에서 GitHub Pages 활성화
4. URL 예시: `https://[your-username].github.io/chzzk-chat-exporter/PRIVACY_POLICY.html`

**옵션 B: 간단한 호스팅 사용**
- Google Sites, Notion 등에 개인정보처리방침 게시
- 공개 URL 복사

**임시 해결책:**
- 일단 제출하려면 GitHub 저장소 URL 입력
- 예: `https://github.com/[username]/chzzk-chat-exporter`
- 나중에 업데이트 가능

---

### 2. 상세 설명 (최소 25자)

**한국어 설명:**
```
치지직(Chzzk) 방송의 채팅을 CSV 파일로 내보내는 확장프로그램입니다. 실시간 채팅을 수집하여 타임스탬프, 사용자 ID, 메시지 내용을 포함한 CSV 파일로 저장할 수 있습니다. 모든 데이터는 로컬에만 저장되며 외부 서버로 전송되지 않습니다.
```

**영어 설명 (글로벌 배포 시):**
```
Export Chzzk live stream chat messages to CSV format. Collect real-time chat with timestamps, user IDs, and message content. All data is stored locally with no external server transmission. Perfect for chat analysis and archiving.
```

---

### 3. 언어 선택

**입력할 값:**
- 기본 언어: **Korean (한국어)**
- UI가 한국어이므로 Korean 권장

---

### 4. 카테고리 선택

**입력할 값:**
- **Productivity (생산성)** 또는 **Developer Tools (개발자 도구)**

---

### 5. 개인 정보 보호 관행 탭 - 권한 정당화

Chrome 웹 스토어 대시보드의 "개인 정보 보호 관행" 탭에서 각 권한에 대한 설명을 입력해야 합니다.

#### Storage 권한
**Single purpose (단일 목적):**
```
To save collected chat messages and video information locally on the user's device.
```

**Permission use (권한 사용):**
```
This extension uses the storage permission to save chat messages (timestamp, user ID, and message content) and video information (title, channel name) in Chrome's local storage. All data stays on the user's device and is never transmitted to any external server.
```

#### ActiveTab 권한
**Single purpose (단일 목적):**
```
To check if the user is currently on a Chzzk live stream page when opening the extension popup.
```

**Permission use (권한 사용):**
```
This extension uses the activeTab permission to access the current tab's URL only when the user clicks the extension icon. This allows the popup to display relevant options and status information when the user is on a Chzzk live stream page.
```

#### Downloads 권한
**Single purpose (단일 목적):**
```
To export collected chat messages as a CSV file to the user's computer.
```

**Permission use (권한 사용):**
```
This extension uses the downloads permission to save the collected chat data as a CSV file when the user clicks the "Export to CSV" button. The file is saved to the user's default download location.
```

#### Host 권한 (chzzk.naver.com)
**Single purpose (단일 목적):**
```
To collect chat messages from Chzzk live stream pages.
```

**Permission use (권한 사용):**
```
This extension uses content scripts to observe and collect chat messages from Chzzk live stream pages (chzzk.naver.com). This is the core functionality that allows users to capture chat data in real-time. The extension only runs on Chzzk pages and does not access any personal user data beyond publicly visible chat messages.
```

---

## 데이터 사용 공개 (Data Usage Disclosure)

"개인 정보 보호 관행" 탭에서 다음 질문들에 답변해야 합니다:

### Does this item collect user data?
**답변:** No

**설명:**
```
This extension does not collect any personal user data. It only captures publicly visible chat messages from Chzzk live streams when the user explicitly starts the collection process. All data is stored locally on the user's device.
```

### Does this item use or transfer user data?
**답변:** No

**설명:**
```
All collected data is stored locally in the browser's storage. No data is transmitted to external servers or third parties.
```

### Does this item sell user data?
**답변:** No

---

## 체크리스트

제출 전 확인사항:

- [ ] 개발자 등록 완료 ($5 지불)
- [ ] 개인정보처리방침 URL 입력 (유효한 공개 URL)
- [ ] 상세 설명 25자 이상 입력
- [ ] 언어 선택: Korean
- [ ] 카테고리 선택: Productivity 또는 Developer Tools
- [ ] Storage 권한 정당화 입력
- [ ] ActiveTab 권한 정당화 입력
- [ ] Downloads 권한 정당화 입력
- [ ] Host 권한 정당화 입력
- [ ] 데이터 수집 여부: No
- [ ] 스크린샷 최소 1개 업로드 (1280x800 권장)
- [ ] 아이콘 확인 (128x128, 48x48, 16x16)
- [ ] ZIP 파일 생성 및 업로드

---

## 빠른 해결 방법

### 지금 당장 제출하려면:

1. **개인정보처리방침 URL**: 
   - 임시로 GitHub 저장소 URL 입력
   - 예: `https://github.com/[username]/chzzk-chat-exporter`

2. **언어**: Korean 선택

3. **카테고리**: Productivity 선택

4. **권한 정당화**: 위의 텍스트를 복사해서 붙여넣기

5. **데이터 사용**: 모두 "No" 선택

6. **스크린샷**: 최소 1개 업로드 (아래 스크린샷 가이드 참조)

이렇게 하면 제출이 가능하고, 나중에 정식 개인정보처리방침 URL로 업데이트할 수 있습니다.

---

## 제출 단계

### 1. ZIP 파일 생성
```bash
cd /Users/hvs/.gemini/antigravity/scratch/chzzk-chat-exporter
zip -r chzzk-chat-exporter.zip . -x "*.DS_Store" -x "__MACOSX" -x "test-page.html" -x "*.md"
```

### 2. Chrome Web Store 개발자 대시보드 접속
https://chrome.google.com/webstore/devconsole

### 3. 새 항목 업로드
- "새 항목" 버튼 클릭
- ZIP 파일 업로드

### 4. 스토어 등록 정보 작성
- STORE_LISTING.md 파일 참조

### 5. 스크린샷 업로드
- SCREENSHOT_GUIDE.md 파일 참조

### 6. 개인정보 보호 설정
- 위의 권한 정당화 텍스트 입력

### 7. 검토 제출
- "검토를 위해 제출" 클릭
- 보통 1-3일 내 검토 완료

---

## 검토 거부 시 대응

### 일반적인 거부 사유:

1. **개인정보처리방침 URL 문제**
   - 해결: 유효한 공개 URL로 업데이트

2. **권한 정당화 불충분**
   - 해결: 더 자세한 설명 추가

3. **스크린샷 부족 또는 품질 문제**
   - 해결: 고품질 스크린샷 추가

4. **설명이 불명확**
   - 해결: 더 자세하고 명확한 설명 작성

---

## 추가 리소스

- [Chrome Web Store 개발자 문서](https://developer.chrome.com/docs/webstore/)
- [확장 프로그램 배포 가이드](https://developer.chrome.com/docs/webstore/publish/)
- [확장 프로그램 정책](https://developer.chrome.com/docs/webstore/program-policies/)
