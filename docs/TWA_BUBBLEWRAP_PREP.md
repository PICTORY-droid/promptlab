# PromptLab TWA / Bubblewrap 준비 문서

이 문서는 PromptLab을 Google Play Store에 모바일 앱 형태로 출시하기 전에, PWA와 Trusted Web Activity, Bubblewrap 준비사항을 정리한 문서입니다.

현재 목표는 기존 PromptLab 웹앱을 새로 Flutter나 React Native로 다시 만드는 것이 아니라, 운영 중인 웹앱 `https://promptlab.io.kr`을 PWA로 정리하고 TWA 방식으로 Android 앱에 포장하는 것입니다.

## 1. 현재 방향

PromptLab은 이미 Next.js 기반 웹앱으로 운영되고 있습니다.

운영 URL:

```text
https://promptlab.io.kr
```

현재 방향은 다음과 같습니다.

```text
Next.js 웹앱
→ PWA 기본 구성
→ TWA / Bubblewrap 패키징
→ Google Play Console 등록
```

새로 네이티브 앱을 만드는 방식은 현재 MVP 단계에서 제외합니다.

제외하는 방식은 다음과 같습니다.

```text
Flutter 재개발
React Native 재개발
Android 네이티브 전체 재구현
iOS 앱 동시 개발
```

이유는 현재 목표가 수업 제출, MVP 검증, Play Store 첫 출시 준비이기 때문입니다.  
기존 웹앱을 그대로 활용하는 PWA + TWA 방식이 가장 안전합니다.

## 2. TWA와 Bubblewrap 개념

TWA는 Android 앱 안에서 신뢰된 웹앱을 실행하는 방식입니다.

일반 WebView와 다르게, TWA는 웹사이트와 Android 앱이 서로 신뢰 관계를 갖고 있다는 것을 Digital Asset Links로 확인합니다.

Bubblewrap은 기존 PWA를 기반으로 TWA Android 프로젝트를 생성하고 빌드하는 CLI 도구입니다.

PromptLab에서는 Bubblewrap을 사용해 `https://promptlab.io.kr`을 Android 앱 패키지로 감싸는 방향을 검토합니다.

## 3. 현재 완료된 준비사항

현재 PromptLab에 반영된 항목은 다음과 같습니다.

```text
PWA manifest 추가
PWA 아이콘 4종 추가
theme color 설정
standalone display 설정
/privacy 개인정보 처리방침 페이지 추가
docs/PLAY_STORE_DATA_SAFETY.md 작성
README 업데이트
모바일 반응형 화면 보완
버튼 터치 반응 보완
Google 로그인 정상 동작
Kakao 로그인 정상 동작
```

관련 파일은 다음과 같습니다.

```text
public/manifest.webmanifest
public/icon-192.png
public/icon-512.png
public/icon-maskable-192.png
public/icon-maskable-512.png
app/privacy/page.tsx
docs/PLAY_STORE_DATA_SAFETY.md
```

## 4. Android 패키징 전 확인할 항목

Bubblewrap을 실행하기 전에 아래 항목을 먼저 확인해야 합니다.

### 4.1 웹앱 접속 확인

확인 URL:

```text
https://promptlab.io.kr
```

확인할 내용:

```text
홈 화면 정상 접속
로그인 화면 정상 접속
Google 로그인 정상
Kakao 로그인 정상
로그아웃 정상
/write 정상
/safecheck 정상
/dashboard 정상
/reports 정상
/privacy 정상
```

### 4.2 PWA manifest 확인

확인 URL:

```text
https://promptlab.io.kr/manifest.webmanifest
```

확인할 내용:

```text
name
short_name
start_url
scope
display: standalone
theme_color
background_color
icons
```

현재 manifest 아이콘 경로:

```text
/icon-192.png
/icon-512.png
/icon-maskable-192.png
/icon-maskable-512.png
```

### 4.3 아이콘 확인

확인 URL:

```text
https://promptlab.io.kr/icon-192.png
https://promptlab.io.kr/icon-512.png
https://promptlab.io.kr/icon-maskable-192.png
https://promptlab.io.kr/icon-maskable-512.png
```

확인할 내용:

```text
브라우저에서 이미지가 깨지지 않고 열리는지 확인
```

### 4.4 개인정보 처리방침 확인

Play Store 제출에는 개인정보 처리방침 URL이 필요합니다.

확인 URL:

```text
https://promptlab.io.kr/privacy
```

확인할 내용:

```text
수집하는 데이터 설명
저장하지 않는 데이터 설명
SafeCheck 원문 미저장 정책
제3자 서비스
문의 이메일
```

### 4.5 Data Safety 문서 확인

내부 준비 문서:

```text
docs/PLAY_STORE_DATA_SAFETY.md
```

Play Console 입력 전 이 문서와 실제 앱 동작이 맞는지 확인해야 합니다.

## 5. Bubblewrap 실행 전 로컬 준비물

실제 Bubblewrap 단계에 들어가기 전 필요한 항목입니다.

```text
Node.js
npm
Android Studio 또는 Android SDK
Java JDK
Android 기기 또는 에뮬레이터
Google Play Developer 계정
운영 중인 HTTPS 웹앱
PWA manifest
PWA icon
privacy policy URL
```

PromptLab은 이미 GitHub, Vercel, Supabase, Google Play 개발자 계정을 사용하는 방향으로 준비되어 있습니다.

## 6. 예상 Bubblewrap 흐름

실제 패키징 단계에서는 다음 흐름으로 진행합니다.

```text
1. Bubblewrap 설치
2. Bubblewrap 초기화
3. manifest URL 입력
4. Android package name 설정
5. app name 설정
6. signing key 생성 또는 연결
7. Android 프로젝트 생성
8. Digital Asset Links 생성
9. public/.well-known/assetlinks.json 등록
10. Android 빌드
11. 실제 기기 테스트
12. Play Console 내부 테스트 업로드
```

예상 패키지명 후보:

```text
kr.co.promptlab.app
```

앱 이름:

```text
PromptLab
```

운영 도메인:

```text
promptlab.io.kr
```

## 7. Digital Asset Links 주의사항

TWA가 정상 동작하려면 Android 앱과 웹사이트가 서로 신뢰 관계를 가져야 합니다.

이를 위해 웹사이트에 아래 파일을 등록해야 합니다.

```text
public/.well-known/assetlinks.json
```

최종 URL은 다음과 같아야 합니다.

```text
https://promptlab.io.kr/.well-known/assetlinks.json
```

이 파일에는 Android 앱 패키지명과 앱 서명 키 fingerprint가 들어갑니다.

주의할 점은 다음과 같습니다.

```text
assetlinks.json은 Bubblewrap으로 패키징하고 서명 키가 정해진 뒤 생성하는 것이 안전합니다.
```

따라서 현재 단계에서는 assetlinks.json을 아직 만들지 않습니다.

## 8. Play Store 제출 전 체크리스트

```text
PWA manifest 확인
PWA icon 확인
/privacy 확인
Data Safety 문서 확인
Google 로그인 확인
Kakao 로그인 확인
로그아웃 확인
SafeCheck 검사 확인
리포트 원문 미저장 확인
모바일 화면 확인
앱 이름 확정
패키지명 확정
스크린샷 준비
앱 설명 준비
심사용 로그인 방법 준비
내부 테스트 트랙 업로드
```

## 9. 현재 결정사항

현재까지 결정된 방향은 다음과 같습니다.

```text
앱 가격: 무료
인앱 구매: 없음
구독: 없음
결제 정보 수집: 없음
광고: 없음
주요 기능: 프롬프트 작성, 저장, SafeCheck 검사, 리포트 확인
패키징 방식: PWA + TWA + Bubblewrap 검토
최종 웹 URL: https://promptlab.io.kr
개인정보 처리방침 URL: https://promptlab.io.kr/privacy
```

## 10. 다음 단계

이 문서 작성 후 다음 순서로 진행합니다.

```text
1. README에 PWA/Play Store 준비 문서 링크 추가
2. 배포 후 manifest, icon, privacy URL 확인
3. Android Studio 또는 Bubblewrap 환경 확인
4. Bubblewrap 실제 초기화
5. assetlinks.json 생성
6. 내부 테스트용 AAB 빌드
```