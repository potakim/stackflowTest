# Stackflow Navigation Use Case - Sample Page PRD

**문서 목적**  
본 문서는 Stackflow 기반 하이브리드 앱의 스택 내비게이션 동작을 검증하기 위한 **샘플 페이지 요구사항(What)** 과 **구현 가이드(How)** 를 정의한다. AI Agent는 이 문서의 사양을 바탕으로 **React** 기반의 샘플 애플리케이션을 생성하여 24가지 유스케이스를 시각적으로 테스트하고 검증할 수 있도록 한다.

- 적용 환경: **Next.js(프론트)** + **Nest.js(백엔드)** (클라이언트 사이드 내비 중심)
- 내비게이션 라이브러리: **Stackflow**
- 대상 범위: 유스케이스 ID **01 ~ 24** (Confluence 표 기준)

> ⚠️ **주의**: 아래 예제 코드의 import 경로/플러그인 명칭은 **프로젝트 설정에 맞춰 조정**해야 합니다. Stackflow 버전/구성에 따라 `@stackflow/*` 패키지명이 상이할 수 있습니다.  
> 예: `@stackflow/core`, `@stackflow/react`, `@stackflow/plugin-basic-renderer`, `@stackflow/plugin-history-sync` 등.

---

## 1) 용어, 범위, 가정

- **Activity(Screen)**: 스택에 푸시되는 화면 컴포넌트. 예: `A`, `B`, `C`, `Login`, `Home`, `Product`, `Order`, `PaymentComplete`
- **Params**: Activity에게 전달되는 라우팅 파라미터 (예: `{ userId: number }`)
- **Actions**: `push`, `pop`, `replace`, `popTo` 등
- **플랫폼 제스처**: iOS 스와이프 백, Android 하드웨어 백 버튼
- **웹 히스토리 동기화**: 브라우저 back/forward와 내부 스택의 일관성

**Out-of-Scope (본 문서 미포함)**
- 서버사이드 렌더링 시점의 내비게이션 (CSR 기준)
- 브릿지 네이티브 제스처(완전한 E2E)

---

## 2) 샘플 페이지 환경 & 도구

- UI 라이브러리: **React**
- 번들러: **Vite**
- 내비게이션: **Stackflow**
- 타입 안전성: **TypeScript** (필수)

> 프로젝트 루트 예시
```
/src
  /components
    /ErrorBoundary.tsx
    /screens.tsx
  /stackflow
    /stack.tsx
  /main.tsx
```

---

## 3) 활동(Activities) & 라우트 스키마

> **참고**: 타입스크립트 버전 및 Stackflow 버전 간의 호환성 문제를 최소화하기 위해, 별도의 `activities.ts` 타입 정의 파일 대신 `stack.tsx`의 `activities` 객체에서 타입을 직접 추론하도록 구현되었습니다.

새롭게 추가된 `Modal`, `ErrorScreen`을 포함한 전체 Activity 리스트는 `stack.tsx` 설정에서 확인할 수 있습니다.

```ts
// src/components/screens.tsx 의 일부
// 화면 컴포넌트 예시 (테스트 식별 가능한 data-testid 포함)
import React from 'react';
import { useActivity } from '@stackflow/react';

export const A = () => (
  <div data-testid="screen-A">
    <h2>Screen A</h2>
    <p>This is the initial screen. Please select a scenario from the left panel.</p>
  </div>
);

export const B = () => {
  const { params } = useActivity();
  return (
    <div data-testid="screen-B">
      <h2>Screen B</h2>
      <p>User ID: {(params as any).userId ?? 'N/A'}</p>
    </div>
  );
};

// ... 기타 컴포넌트 ...

// 에러 바운더리 테스트용 컴포넌트
export const ErrorScreen = () => {
  useEffect(() => {
    throw new Error("This is a test error for ErrorBoundary.");
  }, []);
  return <div>...</div>;
};
```

---

## 4) Stackflow 설정

> 아래는 실제 구현에 사용된 설정 예시입니다. `stackflow` 함수를 사용하며, `basicUIPlugin`을 포함하여 기본적인 UI(헤더 등)를 자동으로 구성합니다.

```ts
// src/stackflow/stack.tsx
import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import * as screens from "../components/screens";

const stack = stackflow({
  transitionDuration: 350,
  activities: screens,
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
    historySyncPlugin({
      routes: {
        A: "/",
        B: "/b",
        C: "/c",
        D: "/d",
        Login: "/login",
        Home: "/home",
        Product: "/product/:productId",
        Order: "/order",
        PaymentComplete: "/payment-complete",
        PopToTest: "/pop-to-test",
        Modal: "/modal",
        ErrorScreen: "/error",
      },
      fallbackActivity: () => "A",
      useHash: true,
    }),
  ],
  initialActivity: () => "A",
});

export const { Stack, useFlow } = stack;
export default stack;
```

---

## 5) 샘플 페이지 UI 구성

샘플 페이지는 2열 레이아웃으로 구성됩니다. 왼쪽 열에는 24개의 유스케이스를 테스트할 수 있는 버튼 목록이 있으며, 오른쪽 열에는 내비게이션 결과가 렌더링되는 `<Stack />` 컴포넌트가 위치합니다.

이러한 구조는 `src/main.tsx` 파일에서 구현됩니다. 시나리오 버튼들은 `useFlow` 훅 대신 `stack.actions`를 직접 호출하여 내비게이션을 트리거합니다.

**UI 예시 (`src/main.tsx` 내부)**

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import stack, { Stack } from './stackflow/stack';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const scenarios = [
  { id: 1, title: '기본 푸시/팝', action: () => stack.actions.push('B', {}) },
  { id: 2, title: '파라미터 전달(필수)', action: () => stack.actions.push('B', { userId: 123 }) },
  // ... 나머지 시나리오 ...
  { id: 21, title: '에러 바운더리', action: () => stack.actions.push('ErrorScreen', {}) },
];

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 왼쪽 열: 시나리오 목록 */}
      <div style={{ width: '350px', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
        <h1>Stackflow Test Scenarios</h1>
        <ul>
          {scenarios.map(s => (
            <li key={s.id}>
              <button onClick={s.action}>
                [{s.id.toString().padStart(2, '0')}] {s.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* 오른쪽 열: 스택 렌더링 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ErrorBoundary>
          <Stack />
        </ErrorBoundary>
      </div>
    </div>
  </React.StrictMode>,
);
```

---

## 6) 테스트 시나리오 목록

각 시나리오는 샘플 페이지의 버튼을 통해 수동으로 트리거하고 결과를 확인한다.

1.  **[01] 기본 푸시/팝**: `A` → `B`로 push 후, 뒤로가기(pop)로 `A` 복귀
2.  **[02] 파라미터 전달(필수)**: `A` → `B`로 `{ userId: 123 }` 전달 및 `B` 화면에서 값 확인
3.  **[03] 파라미터 전달(옵션)**: `B`로 파라미터 없이 push 시 기본값 확인
4.  **[04] 스택 교체(replace)**: `Login` → `Home`으로 replace 후, 뒤로가기 시 앱 종료 또는 이전 스택 없음 확인
5.  **[05] 다중 푸시/팝**: `A` → `B` → `C` 순으로 push 후, `C` → `B` → `A` 순으로 pop
6.  **[06] 특정 화면으로 popTo**: `Product` → `Order` → `PaymentComplete` 후, `Product`로 한 번에 복귀
7.  **[07] popTo 대상 없음**: 스택에 없는 화면으로 `popTo` 시도 시 동작 없음 확인
8.  **[08] 모달/오버레이 영향 분리**: (구현 시) 모달이 열린 상태에서 `push`가 정상 동작하는지 확인
9.  **[09] 모달 뒤로가기 우선순위**: (구현 시) 모달이 열린 상태에서 뒤로가기 시 모달이 먼저 닫히는지 확인
10. **[10] iOS 스와이프 백**: iOS 환경에서 스와이프 제스처로 뒤로가기 동작 확인
11. **[11] Android 하드웨어 백**: Android 환경에서 하드웨어 백 버튼으로 뒤로가기 동작 확인
12. **[12] 존재하지 않는 화면 push**: 정의되지 않은 Activity로 `push` 시도 시 에러 발생 또는 fallback 처리 확인
13. **[13] 파라미터 타입 가드**: 잘못된 타입의 파라미터 전달 시 TypeScript 단에서 에러 발생하는지 확인 (컴파일 타임)
14. **[14] 동일 화면 연속 푸시(더블탭)**: `B` push 버튼을 빠르게 연타 시 한 번만 push 되는지 확인 (전환락/디바운스)
15. **[15] 느린 네트워크 중복 트리거**: (시뮬레이션) API 호출 후 화면 전환 시, 응답 지연 중 재시도해도 한 번만 전환되는지 확인
16. **[16] 파라미터 기반 중복 방지**: 동일 Activity, 동일 파라미터로 중복 `push` 방지
17. **[17] 전환 애니메이션 중 인터랙션**: 화면 전환 애니메이션 중에 다른 내비게이션 액션이 큐잉되거나 무시되는지 확인
18. **[18] 새로고침 시 상태 복원**: `C` 화면에서 새로고침 시 `C` 화면이 유지되는지 확인 (`historySyncPlugin`)
19. **[19] 딥링크 진입**: 특정 URL(예: `/product/P1`)로 직접 접근 시 해당 화면으로 진입하는지 확인
20. **[20] 브라우저 뒤로가기 동기화**: `A`→`B`→`C` 이동 후, 브라우저의 뒤로가기 버튼 클릭 시 `C`→`B`→`A` 순으로 pop 되는지 확인
21. **[21] 에러 바운더리**: 화면 렌더링 중 에러 발생 시 앱 크래시 대신 에러 화면을 보여주는지 확인
22. **[22] 접근성 포커스**: 화면 전환 후, 페이지 제목 등 주요 요소로 포커스가 이동하는지 확인
23. **[23] 성능/메모리 누수**: 많은 화면을 push/pop 반복 후 메모리 사용량이 안정적인지 확인 (개발자 도구)
24. **[24] 텔레메트리/로깅**: 내비게이션 액션 발생 시 콘솔에 로그가 기록되는지 확인  
    > **구현 노트**: 타입스크립트 호환성 이슈로 인해 별도의 로깅 플러그인은 구현에서 제외되었습니다. 대신 `main.tsx`의 시나리오 액션에 포함된 `console.log`를 통해 로깅 동작을 확인할 수 있습니다.

---

## 7) 실행 방법

- **의존성 설치**
```bash
npm install
```

- **개발 서버 실행**
```bash
npm run dev
```

- `package.json` 스크립트 예시
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## 8) Definition of Done (완료 기준)

- [ ] 24개 시나리오를 테스트할 수 있는 버튼이 포함된 샘플 페이지가 정상적으로 렌더링된다.
- [ ] 각 버튼은 시나리오에 맞는 Stackflow 액션을 호출한다.
- [ ] `npm run dev` 명령어로 개발 서버를 실행하고 브라우저에서 샘플 페이지에 접근할 수 있다.
- [ ] 모든 내비게이션 기능이 문서에 기술된 대로 동작한다.

---

### 끝.
