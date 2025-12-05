# 프로젝트 구조

```
chzzk-chat-exporter/
├── manifest.json           # Chrome 확장프로그램 설정 파일
├── popup.html             # 확장프로그램 팝업 UI
├── popup.css              # 팝업 스타일시트
├── popup.js               # 팝업 로직 및 UI 제어
├── content.js             # 치지직 페이지에서 실행되는 스크립트
├── background.js          # 백그라운드 서비스 워커
├── icons/                 # 확장프로그램 아이콘
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md              # 프로젝트 설명서
├── PRIVACY_POLICY.md      # 개인정보 처리방침
├── INSTALLATION.md        # 설치 가이드
└── test-page.html         # 테스트용 페이지
```

## 파일 설명

### manifest.json
- Chrome Extension Manifest V3 형식
- 필요한 권한 및 설정 정의
- content script, background script, popup 설정

### popup.html / popup.css / popup.js
- 사용자 인터페이스
- 채팅 수집 시작/중지 버튼
- CSV 내보내기 기능
- 실시간 상태 표시

### content.js
- 치지직 페이지에서 실행
- MutationObserver를 사용한 실시간 채팅 감지
- DOM에서 채팅 메시지 추출
- 로컬 스토리지에 데이터 저장

### background.js
- 백그라운드에서 실행되는 서비스 워커
- CSV 내보내기 처리
- 확장프로그램 생명주기 관리

## 주요 기능

### 1. 채팅 수집
- MutationObserver로 실시간 채팅 감지
- 타임스탬프, 사용자 ID, 메시지 내용 추출
- 중복 메시지 필터링

### 2. 데이터 저장
- Chrome Storage API 사용
- 로컬 브라우저에만 저장
- 외부 서버 전송 없음

### 3. CSV 내보내기
- UTF-8 BOM 포함 (Excel 호환성)
- 쉼표, 따옴표 등 특수문자 이스케이프 처리
- 자동 파일명 생성 (채널명_날짜.csv)

## 기술 스택

- **Manifest V3**: 최신 Chrome Extension API
- **Vanilla JavaScript**: 프레임워크 없이 순수 JS 사용
- **MutationObserver API**: DOM 변경 감지
- **Chrome Storage API**: 로컬 데이터 저장
- **Chrome Downloads API**: 파일 다운로드

## 보안 및 프라이버시

- ✅ 모든 데이터는 로컬에만 저장
- ✅ 외부 서버로 데이터 전송 없음
- ✅ 최소한의 권한만 요청
- ✅ 오픈소스로 코드 투명성 보장

## 개발 노트

### 치지직 DOM 구조
치지직의 채팅 DOM 구조는 변경될 수 있으므로, content.js의 `findChatContainer()` 함수에서 여러 선택자를 시도합니다:

```javascript
const selectors = [
  '[class*="live_chatting_list"]',
  '[class*="ChatList"]',
  '[class*="chat_list"]',
  // ...
];
```

### 중복 메시지 방지
최근 10개 메시지를 확인하여 1초 이내에 동일한 사용자의 동일한 메시지가 있으면 중복으로 간주합니다.

### CSV 인코딩
Excel에서 한글이 깨지지 않도록 UTF-8 BOM(`\uFEFF`)을 파일 시작 부분에 추가합니다.

## 향후 개선 사항

- [ ] 다시보기 채팅 지원 (현재는 실시간 채팅만)
- [ ] 채팅 필터링 기능 (특정 사용자, 키워드)
- [ ] JSON 내보내기 옵션
- [ ] 채팅 통계 기능
- [ ] 이모티콘 이미지 URL 저장
- [ ] 다국어 지원

## 문제 해결

### 채팅이 수집되지 않는 경우
1. 치지직 페이지 구조가 변경되었을 수 있음
2. `content.js`의 선택자를 업데이트 필요
3. 브라우저 콘솔에서 에러 메시지 확인

### 성능 최적화
- 10개 메시지마다 스토리지에 저장 (배터리 절약)
- MutationObserver는 childList만 감시 (성능 향상)
- 중복 체크는 최근 10개만 확인 (메모리 절약)
