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
  /app
  /components
    /screens
  /stackflow
    /activities.ts
    /stack.tsx
  /App.tsx
  /main.tsx
```

---

## 3) 활동(Activities) & 라우트 스키마

> 실제 프로젝트의 Activity 리스트와 Params 타입에 맞춰 조정하세요.

```ts
// src/stackflow/activities.ts
export type Activities =
  | { name: 'A'; params?: {} }
  | { name: 'B'; params?: { userId?: number } }
  | { name: 'C'; params?: {} }
  | { name: 'Login'; params?: {} }
  | { name: 'Home'; params?: {} }
  | { name: 'Product'; params?: { productId: string } }
  | { name: 'Order'; params?: { orderId?: string } }
  | { name: 'PaymentComplete'; params?: { receiptId: string } };

// 화면 컴포넌트 예시 (테스트 식별 가능한 data-testid 포함)
// src/components/screens.tsx
import React from 'react';
import { useActivity } from '@stackflow/react';

export const A = () => <div data-testid="screen-A">Screen A</div>;
export const B = () => {
  const { params } = useActivity<{ userId?: number }>();
  return (
    <div data-testid="screen-B">
      Screen B
      <span data-testid="userId">{params.userId ?? 'default'}</span>
    </div>
  );
};
export const C = () => <div data-testid="screen-C">Screen C</div>;
export const Login = () => <div data-testid="screen-Login">Login</div>;
export const Home = () => <div data-testid="screen-Home">Home</div>;
export const Product = () => <div data-testid="screen-Product">Product</div>;
export const Order = () => <div data-testid="screen-Order">Order</div>;
export const PaymentComplete = () => (
  <div data-testid="screen-PaymentComplete">Payment Complete</div>
);
```

---

## 4) Stackflow 설정

> 아래는 **샘플 페이지용** 설정 예시입니다.

```ts
// src/stackflow/stack.tsx
import React from 'react';
import { createStackflow, Stack } from '@stackflow/react';
import { basicRendererPlugin } from '@stackflow/plugin-basic-renderer';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import { Activities, A, B, C, Login, Home, Product, Order, PaymentComplete } from '../components/screens';

export const { Stack, useFlow } = createStackflow<Activities>({
  activities: {
    A, B, C, Login, Home, Product, Order, PaymentComplete,
  },
  plugins: [
    basicRendererPlugin(),
    historySyncPlugin({
      fallbackActivity: () => 'A',
    }),
  ],
  initialActivity: () => 'A',
});
```

---

## 5) 샘플 페이지 UI 구성

메인 페이지 (`A` Activity)에 24개 유스케이스를 테스트할 수 있는 버튼 목록을 제공한다. 각 버튼은 해당 시나리오에 맞는 `flow` 액션을 트리거해야 한다.

**UI 예시 (`A` 컴포넌트 내부)**

```tsx
// src/components/screens.tsx 의 A 컴포넌트 수정
import { useFlow } from '../stackflow/stack';

export const A = () => {
  const flow = useFlow();

  return (
    <div data-testid="screen-A">
      <h1>Stackflow Test Scenarios</h1>
      <ul>
        {/* 시나리오 1 */}
        <li><button onClick={() => flow.push('B')}>[01] Push B</button></li>
        {/* 시나리오 2 */}
        <li><button onClick={() => flow.push('B', { userId: 123 })}>[02] Push B with param</button></li>
        {/* 시나리오 4 */}
        <li><button onClick={() => {
          flow.push('Login');
          setTimeout(() => flow.replace('Home'), 500);
        }}>[04] Replace Login to Home</button></li>
        {/* ... 나머지 24개 시나리오 버튼 ... */}
      </ul>
    </div>
  );
};
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
