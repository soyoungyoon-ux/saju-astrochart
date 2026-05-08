# 命 · Astrochart 統合

> 사주명리 · 서양점성술 통합 AI 리딩 앱  
> *오늘의 나보다 조금 더 나은 내가 되는 법,*  
> *그리고 주위 사람들에게 더 좋은 사람이 되는 것.*

---

## 🚀 Vercel 배포 가이드 (15분)

### 사전 준비
- [ ] GitHub 계정 (없으면 https://github.com 가입)
- [ ] Vercel 계정 (https://vercel.com — GitHub로 로그인 가능)
- [ ] Anthropic API 키 (https://console.anthropic.com → API Keys)

---

### 단계 1: 프로젝트를 GitHub에 올리기

#### 옵션 A: GitHub Desktop 사용 (마우스로 클릭)
1. https://desktop.github.com 에서 GitHub Desktop 다운로드
2. 로그인 → "Add an existing repository from your hard drive"
3. 이 `saju-app` 폴더 선택
4. "Publish repository" 클릭 → 이름 (예: `saju-astrochart`) → **Private 체크 해제** → Publish

#### 옵션 B: 터미널 (Mac)
```bash
cd saju-app
git init
git add .
git commit -m "Initial commit"
# GitHub에서 새 리포지토리 만들고 URL 복사 후:
git remote add origin https://github.com/YOUR_USERNAME/saju-astrochart.git
git branch -M main
git push -u origin main
```

---

### 단계 2: Vercel에서 배포하기

1. https://vercel.com 접속 → GitHub로 로그인
2. **"Add New" → "Project"** 클릭
3. 방금 만든 `saju-astrochart` 리포지토리 선택 → **"Import"**
4. Framework Preset: **Vite** (자동 감지됨)
5. **"Environment Variables" 펼치기** ⚠️ 중요!
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...` (Anthropic 콘솔에서 복사한 키)
   - **"Add"** 클릭
6. **"Deploy"** 클릭
7. 약 1~2분 후 배포 완료 → `https://saju-astrochart-xxx.vercel.app` 같은 URL 받음 🎉

---

### 단계 3: 커스텀 도메인 (선택)

내 도메인이 있다면:
1. Vercel 프로젝트 → "Settings" → "Domains"
2. 도메인 입력 (예: `saju.example.com`)
3. 도메인 등록업체에서 DNS 설정 (Vercel이 안내해줌)

또는 Vercel에서 무료로 `.vercel.app` 도메인을 그대로 사용 가능.

---

## 💻 로컬 개발

```bash
# 1. 의존성 설치
npm install

# 2. .env.local 파일 만들기
cp .env.example .env.local
# .env.local 열어서 ANTHROPIC_API_KEY 값 입력

# 3. 개발 서버 시작
npm run dev
# → http://localhost:5173 접속
```

---

## 🔐 보안

✅ **클라이언트는 절대 API 키를 보지 못합니다**
- API 키는 Vercel 서버 환경변수에만 저장
- 모든 Anthropic API 호출은 `/api/anthropic/v1/messages` 서버리스 함수를 거침
- 브라우저 개발자도구로도 키 노출 안 됨

⚠️ **공개 사용 시 주의**
- 누구나 접속해서 무제한 호출 가능 → API 비용 발생
- 친구·가족용이면 그대로 OK
- 공개 서비스로 만들 거면 다음을 추가 권장:
  - Vercel Edge Middleware로 IP/요청 제한
  - 간단한 비밀번호 보호
  - 또는 Supabase Auth로 로그인 추가

---

## 📂 프로젝트 구조

```
saju-app/
├── api/
│   └── anthropic/v1/messages.js   # 서버리스 API 프록시
├── public/
│   └── icon.svg                    # 파비콘
├── src/
│   ├── App.jsx                     # 메인 앱 (1900+ 라인)
│   └── main.jsx                    # React 진입점
├── index.html                      # HTML 진입점
├── package.json                    # 의존성
├── vercel.json                     # Vercel 설정
├── vite.config.js                  # Vite 빌드 설정
└── .env.example                    # 환경변수 예시
```

---

## ✨ 주요 기능

- **정확한 만세력**: 천문학적 24절기 기반, 야자시 처리, 정확한 대운수
- **서양 점성술**: 12궁 · 10행성 · 어센던트 · 어스펙트
- **오행 분석**: 신강신약, 용희기구한신
- **AI 통합 리딩**: Claude Sonnet 4 기반, 7개 섹션
- **출생지 검색**: OpenStreetMap (API 키 불필요)
- **차트 저장**: localStorage + JSON 내보내기/가져오기
- **궁합 분석**: 천간합충, 지지 육합/삼합/충/형/원진, 점성술 시너지

---

## 🌱 철학

> **좋은 사주도 나쁜 사주도 없습니다.**  
> **모든 명식은 자기 자신을 비추는 거울입니다.**

이 앱은 운명을 예언하지 않습니다.  
모든 통찰은 한 가지로 수렴합니다 —  
**오늘의 나보다 조금 더 나은 내가 되는 길.**
