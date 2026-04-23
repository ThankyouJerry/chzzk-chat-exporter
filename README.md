# chzzk-chat-exporter

치지직 방송의 채팅을 CSV 파일로 내보내는 크롬 확장 프로그램입니다.

이 프로젝트는 [ClipCatcher](https://github.com/ThankyouJerry/ClipCatcher)와 함께 사용할 수 있는 보조 도구입니다. 채팅 데이터를 추출해 방송 분석, 하이라이트 탐색, 후처리 워크플로우에 활용할 수 있습니다.

## Project Position

- 대표 프로젝트: [ClipCatcher](https://github.com/ThankyouJerry/ClipCatcher)
- 보조 도구: `chzzk-chat-exporter`
- 역할: 채팅 데이터를 수집하고 CSV로 내보내기

## Main Features

- 치지직 채팅 수집
- CSV 파일로 내보내기
- 타임스탬프 포함 기록
- 사용자 ID 포함 기록
- 데이터 분석 및 후처리용 포맷 제공

## Best Used With

- 방송 다시보기 분석
- 하이라이트 탐색
- 채팅 반응 구간 분석
- 후속 분석 도구와 연계

## Output Format

```csv
Timestamp,User ID,Message
2025-12-05T07:30:00.000Z,user123,안녕하세요!
2025-12-05T07:30:05.123Z,user456,ㅋㅋㅋㅋ
```

## Related Workflow

1. `chzzk-chat-exporter`로 채팅 CSV 추출
2. 필요 시 분석 도구에서 반응 구간 확인
3. 영상 다운로드는 `ClipCatcher` 사용

## Installation

Chrome 확장 프로그램 개발자 모드에서 직접 설치해 사용할 수 있습니다.

## License

MIT License
