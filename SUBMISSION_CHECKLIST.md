# Chrome Web Store 제출 체크리스트

## 📋 제출 전 최종 확인

### ✅ 필수 준비사항

#### 1. 개발자 등록
- [ ] Chrome Web Store 개발자 계정 생성
- [ ] $5 개발자 등록 비용 지불
- [ ] 개발자 대시보드 접속 확인: https://chrome.google.com/webstore/devconsole

#### 2. ZIP 파일 준비
- [x] `build-store-package.sh` 스크립트 실행 완료
- [x] `chzzk-chat-exporter-v1.0.0.zip` 파일 생성 (712K)
- [x] ZIP 파일 내용 확인 (10개 파일)
- [ ] ZIP 파일 압축 해제 테스트 (오류 없는지 확인)

#### 3. 아이콘 준비
- [x] icon16.png (16x16)
- [x] icon48.png (48x48)
- [x] icon128.png (128x128)
- [x] 모든 아이콘이 ZIP에 포함됨

#### 4. 스크린샷 준비
- [ ] 최소 1개 스크린샷 촬영 (권장: 3-5개)
- [ ] 크기: 1280x800 또는 640x400
- [ ] 형식: PNG 또는 JPEG
- [ ] 각 파일 크기 5MB 이하
- [ ] `screenshots/` 폴더에 저장

**필수 스크린샷:**
- [ ] 1. 확장프로그램 팝업 초기 화면
- [ ] 2. 채팅 수집 중 화면
- [ ] 3. CSV 내보내기 준비 화면

**추가 스크린샷 (권장):**
- [ ] 4. 실제 치지직 방송 페이지
- [ ] 5. CSV 파일 예시 (Excel/Sheets)

#### 5. 개인정보처리방침 URL
- [ ] GitHub 저장소 생성
- [ ] PRIVACY_POLICY.md 업로드
- [ ] GitHub Pages 활성화 (선택사항)
- [ ] URL 준비: `https://github.com/[username]/chzzk-chat-exporter`

---

## 📝 스토어 등록 정보 준비

### 기본 정보
- [ ] **이름**: 치지직 채팅 내보내기 - Chzzk Chat Exporter
- [ ] **요약**: 치지직 방송의 채팅을 CSV로 내보내세요 (132자 이내)
- [ ] **상세 설명**: STORE_LISTING.md 참조
- [ ] **카테고리**: Productivity
- [ ] **언어**: Korean

### 링크
- [ ] **Support URL**: GitHub Issues 링크
- [ ] **Homepage URL**: GitHub 저장소 링크
- [ ] **Privacy Policy URL**: 개인정보처리방침 링크

---

## 🔒 개인정보 보호 관행

### 데이터 사용 공개
- [ ] Does this item collect user data? → **No**
- [ ] Does this item use or transfer user data? → **No**
- [ ] Does this item sell user data? → **No**

### 권한 정당화 (CHROME_STORE_SUBMISSION.md 참조)

#### Storage 권한
- [ ] Single purpose 입력 완료
- [ ] Permission use 입력 완료

#### ActiveTab 권한
- [ ] Single purpose 입력 완료
- [ ] Permission use 입력 완료

#### Downloads 권한
- [ ] Single purpose 입력 완료
- [ ] Permission use 입력 완료

#### Host 권한 (chzzk.naver.com)
- [ ] Single purpose 입력 완료
- [ ] Permission use 입력 완료

---

## 🧪 테스트

### 로컬 테스트
- [ ] Chrome에서 확장프로그램 로드 테스트
- [ ] 치지직 생방송 페이지에서 작동 확인
- [ ] 채팅 수집 기능 테스트
- [ ] CSV 내보내기 기능 테스트
- [ ] 다양한 브라우저 크기에서 테스트
- [ ] 오류 콘솔 확인 (에러 없음)

### 기능 체크
- [ ] 확장프로그램 아이콘 클릭 시 팝업 정상 작동
- [ ] 치지직 페이지 감지 정상 작동
- [ ] 채팅 수집 시작/중지 정상 작동
- [ ] 실시간 채팅 개수 업데이트 정상 작동
- [ ] CSV 파일 다운로드 정상 작동
- [ ] CSV 파일 인코딩 정상 (한글 깨짐 없음)
- [ ] 로컬 스토리지 저장/불러오기 정상 작동

---

## 📤 제출 단계

### 1. 대시보드 접속
- [ ] https://chrome.google.com/webstore/devconsole 접속
- [ ] Google 계정 로그인

### 2. 새 항목 업로드
- [ ] "새 항목" 버튼 클릭
- [ ] `chzzk-chat-exporter-v1.0.0.zip` 파일 업로드
- [ ] 업로드 성공 확인

### 3. 스토어 등록 정보 작성
- [ ] 이름 입력
- [ ] 요약 입력 (132자 이내)
- [ ] 상세 설명 입력 (STORE_LISTING.md 복사)
- [ ] 카테고리 선택: Productivity
- [ ] 언어 선택: Korean

### 4. 그래픽 자료 업로드
- [ ] 스크린샷 업로드 (최소 1개)
- [ ] 각 스크린샷에 설명 추가 (선택사항)
- [ ] 홍보용 이미지 업로드 (선택사항)

### 5. 개인정보 보호 설정
- [ ] 개인정보처리방침 URL 입력
- [ ] 데이터 수집 여부: No
- [ ] 각 권한에 대한 정당화 입력

### 6. 배포 설정
- [ ] 공개 범위 선택: 공개
- [ ] 지역 선택: 모든 지역 또는 특정 지역
- [ ] 가격: 무료

### 7. 최종 검토
- [ ] 모든 필수 항목 입력 확인
- [ ] 미리보기로 스토어 페이지 확인
- [ ] 오타 및 오류 확인

### 8. 제출
- [ ] "검토를 위해 제출" 버튼 클릭
- [ ] 제출 확인 메시지 확인
- [ ] 이메일 알림 확인

---

## ⏰ 제출 후

### 검토 대기
- 예상 검토 시간: **1-3일**
- 상태 확인: 개발자 대시보드에서 확인
- 이메일 알림: 검토 결과 통보

### 검토 통과 시
- [ ] 승인 이메일 확인
- [ ] Chrome Web Store에서 확장프로그램 확인
- [ ] 설치 링크 공유
- [ ] README.md에 스토어 링크 추가

### 검토 거부 시
- [ ] 거부 사유 확인
- [ ] 필요한 수정 사항 파악
- [ ] 수정 후 재제출

---

## 📊 제출 후 관리

### 업데이트 배포
1. [ ] manifest.json의 version 업데이트
2. [ ] 변경 사항 테스트
3. [ ] 새 ZIP 파일 생성
4. [ ] 개발자 대시보드에서 업로드
5. [ ] 변경 사항 설명 작성
6. [ ] 제출

### 사용자 피드백
- [ ] 리뷰 모니터링
- [ ] 버그 리포트 확인
- [ ] GitHub Issues 관리

---

## 🎯 빠른 제출 가이드

**최소한으로 빠르게 제출하려면:**

1. ✅ ZIP 파일 업로드 (이미 완료)
2. ✅ 이름, 요약, 설명 입력 (STORE_LISTING.md 복사)
3. ✅ 스크린샷 1개 업로드
4. ✅ 개인정보처리방침 URL: GitHub 저장소 URL
5. ✅ 권한 정당화: CHROME_STORE_SUBMISSION.md 복사
6. ✅ 데이터 사용: 모두 "No"
7. ✅ 제출!

---

## 📚 참고 문서

- **STORE_LISTING.md**: 스토어 등록 정보 전체
- **CHROME_STORE_SUBMISSION.md**: 제출 가이드 및 권한 정당화
- **SCREENSHOT_GUIDE.md**: 스크린샷 촬영 가이드
- **PRIVACY_POLICY.md**: 개인정보처리방침
- **README.md**: 프로젝트 전체 설명

---

## ✅ 최종 확인

모든 항목을 확인했다면:

- [ ] 이 체크리스트의 모든 필수 항목 완료
- [ ] 테스트 완료
- [ ] 문서 검토 완료
- [ ] 제출 준비 완료!

**🎉 준비가 완료되었습니다! Chrome Web Store에 제출하세요!**

---

## 🆘 도움이 필요하면

- Chrome Web Store 개발자 문서: https://developer.chrome.com/docs/webstore/
- Chrome Extension 문서: https://developer.chrome.com/docs/extensions/
- GitHub Issues: 프로젝트 저장소의 Issues 탭

**행운을 빕니다! 🍀**
