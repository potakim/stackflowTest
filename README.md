# Stackflow Navigation Test Sample

이 프로젝트는 [Stackflow](https://stackflow.so/) 라이브러리를 사용하여 다양한 내비게이션 유스케이스를 테스트하기 위해 만들어진 샘플 애플리케이션입니다.

`stackFlowUseCasePRD.md` 문서에 정의된 기본 시나리오와 `navigation_test_cases.md`에 정의된 고급 시나리오를 직접 실행하고 확인할 수 있습니다.

## 🚀 시작하기

### 1. 의존성 설치

프로젝트를 실행하기 위해 필요한 라이브러리들을 설치합니다.

```bash
npm install
```

### 2. 개발 서버 실행

#### 기본 테스트 시나리오

아래 명령어를 실행하여 Vite 개발 서버를 시작합니다.

```bash
npm run dev
```

서버가 시작되면, 브라우저를 열고 `http://localhost:5173` 주소로 접속하여 샘플 페이지를 확인할 수 있습니다.

#### 고급 내비게이션 테스트 시나리오

고급 내비게이션 테스트 케이스를 위한 별도의 테스트 페이지를 실행합니다.

```bash
npm run dev:nav
```

이 명령은 `navigation.html`을 기본 페이지로 하여 서버를 시작합니다.

## 🧪 테스트 시나리오

- **기본 시나리오**: 메인 페이지(`index.html`)에는 `stackFlowUseCasePRD.md`에 기반한 24가지 테스트 시나리오 버튼이 있습니다.
- **고급 시나리오**: 내비게이션 테스트 페이지(`navigation.html`)에서는 `navigation_test_proc.md`에 따라 고급 케이스들을 구현하고 테스트합니다.

## 📜 사용 가능한 스크립트

- `npm run dev`: 개발 모드로 기본 애플리케이션을 실행합니다.
- `npm run dev:nav`: 개발 모드로 고급 내비게이션 테스트 페이지를 실행합니다.
- `npm run build`: 프로덕션용으로 애플리케이션을 빌드합니다.
- `npm run preview`: 빌드된 결과물을 미리 확인합니다.

---

Let's code, Master! 💻
