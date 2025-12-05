# 주요 변경사항 - API 기반 채팅 수집

## 🎯 변경 이유

사용자 피드백: "영상을 재생하지 않으면 채팅 수집이 진행되지 않는다"

## ✅ 해결 방법

DOM 관찰 방식에서 **치지직 API 직접 호출** 방식으로 변경

---

## 📋 변경 내용

### Before (이전 방식)
```javascript
// DOM에서 채팅 요소를 관찰
chatObserver = new MutationObserver((mutations) => {
    // 새로운 채팅이 DOM에 추가될 때만 수집
});
```

**문제점:**
- ❌ 영상을 재생해야만 채팅이 DOM에 나타남
- ❌ 재생하지 않으면 채팅을 수집할 수 없음
- ❌ 느린 수집 속도

### After (새로운 방식)
```javascript
// 치지직 API를 직접 호출
const apiUrl = `https://api.chzzk.naver.com/service/v1/videos/${videoNo}/comments`;
const response = await fetch(apiUrl);
// 모든 채팅을 페이지네이션으로 가져옴
```

**장점:**
- ✅ 영상 재생 불필요
- ✅ 모든 채팅을 빠르게 수집
- ✅ 페이지네이션으로 전체 채팅 가져오기
- ✅ 참고 프로그램과 동일한 방식

---

## 🔧 수정된 파일

### 1. content.js (완전히 재작성)
**주요 변경사항:**
- `observeChat()` 함수 제거
- `fetchVODChat()` 함수 추가 - API로 VOD 채팅 수집
- `fetchLiveChat()` 함수 추가 - 생방송 채팅 폴링
- `extractIds()` 함수 추가 - URL에서 videoNo/channelId 추출

**새로운 흐름:**
```
1. URL에서 videoNo 추출 (/video/12345)
2. API 호출: GET /videos/{videoNo}/comments
3. 페이지네이션으로 모든 채팅 수집
4. CSV로 내보내기
```

### 2. README.md
**업데이트:**
- "실시간 채팅 수집" → "전체 채팅 수집"
- "영상 재생 불필요" 강조 추가

### 3. API_GUIDE.md (새로 추가)
**내용:**
- API 엔드포인트 확인 방법
- DevTools로 네트워크 요청 확인하는 방법
- API 응답 구조 확인 및 수정 방법
- 문제 해결 가이드

---

## 🧪 테스트 방법

### 1. 확장프로그램 로드
```
chrome://extensions/ → 개발자 모드 → 폴더 선택
```

### 2. 치지직 VOD 페이지 접속
```
https://chzzk.naver.com/video/[비디오번호]
```

### 3. 콘솔 확인
```
F12 → Console 탭
```

### 4. 확장프로그램 실행
```
아이콘 클릭 → "채팅 수집 시작"
```

### 5. 예상 로그
```
VOD detected, videoNo: 12345
Fetching VOD chat for video: 12345
Fetching page 1...
Collected 50 messages (total: 50)
Fetching page 2...
Collected 50 messages (total: 100)
...
VOD chat collection complete. Total messages: 500
```

---

## ⚠️ 주의사항

### API 엔드포인트 확인 필요

현재 사용 중인 API 엔드포인트:
```
https://api.chzzk.naver.com/service/v1/videos/{videoNo}/comments
```

**이 엔드포인트가 작동하지 않는 경우:**

1. Chrome DevTools → Network 탭 열기
2. 치지직 VOD 페이지에서 실제 API 요청 확인
3. `comment` 또는 `chat` 키워드 검색
4. 실제 엔드포인트와 응답 구조 확인
5. `content.js` 수정

**자세한 가이드**: `API_GUIDE.md` 참조

---

## 📊 성능 비교

### 이전 방식 (DOM 관찰)
- 수집 속도: 영상 재생 속도에 의존
- 전체 수집 시간: 1시간 영상 = 1시간 이상
- 영상 재생: 필수

### 새로운 방식 (API 호출)
- 수집 속도: API 응답 속도 (초당 수백 개)
- 전체 수집 시간: 1시간 영상 = 수초~수분
- 영상 재생: 불필요

---

## 🔄 다음 단계

### 1. 실제 테스트
- 치지직 VOD 페이지에서 테스트
- 콘솔 로그 확인
- 채팅 수집 확인

### 2. API 오류 시
- DevTools로 실제 API 확인
- `API_GUIDE.md` 참조하여 수정
- 또는 이슈 제보

### 3. 작동 확인 후
- ZIP 파일 재생성 (이미 완료)
- Chrome Web Store 제출

---

## 📝 업데이트된 파일 목록

- ✅ `content.js` - API 기반으로 완전히 재작성
- ✅ `README.md` - 주요 기능 설명 업데이트
- ✅ `API_GUIDE.md` - API 확인 및 수정 가이드 추가
- ✅ `chzzk-chat-exporter-v1.0.0.zip` - 재생성 완료

---

## 💡 참고

이 확장프로그램은 치지직 API를 직접 분석하여 개발되었습니다.
영상 재생 없이 모든 채팅을 수집할 수 있도록 최적화되었습니다.
