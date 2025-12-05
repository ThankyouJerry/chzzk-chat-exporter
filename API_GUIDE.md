# API 엔드포인트 확인 및 업데이트 가이드

## 현재 상황

확장프로그램이 치지직 API를 직접 호출하도록 수정되었습니다. 이제 영상을 재생하지 않아도 모든 채팅을 수집할 수 있습니다.

## API 엔드포인트 확인 방법

실제 치지직 API 엔드포인트를 확인하려면:

### 1. Chrome DevTools로 네트워크 요청 확인

1. 치지직 VOD 페이지 접속 (예: https://chzzk.naver.com/video/12345)
2. Chrome DevTools 열기 (F12 또는 Cmd+Option+I)
3. **Network** 탭 선택
4. **Fetch/XHR** 필터 선택
5. 페이지 새로고침
6. 채팅 관련 API 요청 찾기

**찾아야 할 패턴:**
- `/videos/{videoNo}/comments`
- `/videos/{videoNo}/chat`
- `/live/{channelId}/chat`
- 또는 `comment`, `chat` 키워드가 포함된 요청

### 2. API 응답 구조 확인

API 요청을 클릭하여 응답 구조 확인:

```json
{
  "code": 200,
  "content": {
    "comments": [
      {
        "commentId": "...",
        "content": "채팅 메시지",
        "userNickname": "사용자이름",
        "createTime": 1234567890000,
        ...
      }
    ],
    "next": "다음페이지커서"
  }
}
```

### 3. content.js 업데이트

확인한 API 구조에 맞게 `content.js`의 다음 부분을 수정:

#### VOD API 엔드포인트 (90번째 줄 근처)
```javascript
const apiUrl = `https://api.chzzk.naver.com/service/v1/videos/${videoNo}/comments`;
```

#### 응답 데이터 파싱 (115번째 줄 근처)
```javascript
if (data.content && data.content.comments) {
    const comments = data.content.comments;
    
    comments.forEach(comment => {
        const chatMessage = {
            timestamp: new Date(comment.createTime || Date.now()).toISOString(),
            userId: comment.userNickname || comment.userId || 'Unknown',
            message: comment.content || ''
        };
        
        chatData.push(chatMessage);
    });
}
```

## 현재 구현된 API 엔드포인트

### VOD (다시보기)
```
GET https://api.chzzk.naver.com/service/v1/videos/{videoNo}/comments
```

**예상 응답:**
```json
{
  "content": {
    "comments": [...],
    "next": "cursor"
  }
}
```

### Live (생방송)
```
GET https://api.chzzk.naver.com/polling/v1/channels/{channelId}/live-detail
```

**참고:** 생방송은 WebSocket을 사용할 수도 있습니다.

## 테스트 방법

### 1. 확장프로그램 로드
```
1. chrome://extensions/ 접속
2. 개발자 모드 ON
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. chzzk-chat-exporter 폴더 선택
```

### 2. 치지직 VOD 페이지 접속
```
https://chzzk.naver.com/video/[비디오번호]
```

### 3. 확장프로그램 실행
```
1. 확장프로그램 아이콘 클릭
2. "채팅 수집 시작" 클릭
3. 콘솔 확인 (F12 → Console 탭)
```

### 4. 콘솔 로그 확인

**성공 시:**
```
VOD detected, videoNo: 12345
Fetching VOD chat for video: 12345
Fetching page 1...
Collected 50 messages (total: 50)
Fetching page 2...
...
VOD chat collection complete. Total messages: 500
```

**실패 시:**
```
API request failed: 404
또는
API request failed: 403
```

## 문제 해결

### API 404 오류
- API 엔드포인트가 변경되었을 수 있음
- DevTools로 실제 API 확인 필요

### API 403 오류
- 인증이 필요할 수 있음
- 쿠키나 헤더 추가 필요

### 데이터 파싱 오류
- API 응답 구조가 다를 수 있음
- DevTools로 실제 응답 구조 확인 후 코드 수정

## API 인증이 필요한 경우

만약 API가 인증을 요구한다면:

### 1. 쿠키 가져오기
```javascript
// content.js에 추가
const cookies = document.cookie;
```

### 2. 헤더에 추가
```javascript
const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Cookie': cookies,
        // 또는
        'Authorization': 'Bearer TOKEN'
    },
    credentials: 'include' // 쿠키 포함
});
```

## 대안: DOM 관찰 + API 조합

API가 작동하지 않는 경우, 두 가지 방법을 조합:

1. **API로 과거 채팅 가져오기**
2. **DOM 관찰로 실시간 채팅 추가**

이렇게 하면 모든 채팅을 수집할 수 있습니다.

## 다음 단계

1. 실제 치지직 VOD 페이지에서 테스트
2. 콘솔 로그 확인
3. API 오류 시 DevTools로 실제 API 확인
4. 필요 시 `content.js` 수정
5. 작동 확인 후 ZIP 파일 재생성

## 도움이 필요하면

실제 API 엔드포인트를 찾기 어려운 경우:
1. 치지직 VOD 페이지 URL 공유
2. DevTools Network 탭 스크린샷 공유
3. API 응답 예시 공유

그러면 정확한 코드로 수정해드리겠습니다!
