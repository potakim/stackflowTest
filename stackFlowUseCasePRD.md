# Stackflow Navigation Use Case PRD & Test Spec

**문서 목적**  
본 문서는 Stackflow 기반 하이브리드 앱의 스택 내비게이션 동작을 보장하기 위한 **테스트 요구사항(What)** 과 이를 자동화/생성하기 위한 **테스트 설계 가이드(How)** 를 정의한다. AI Agent는 이 문서의 사양을 바탕으로 **Jest + React Testing Library(RTL)** 중심의 단위/통합 테스트 코드를 생성한다.

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
- 브릿지 네이티브 제스처(완전한 E2E) → 필요 시 Detox/Appium 별도 문서로 분리

---

## 2) 테스트 환경 & 도구

- 테스트 러너: **Jest**
- DOM 테스트: **React Testing Library(@testing-library/react)** + **@testing-library/user-event**
- 타이머/이벤트: **Jest fake timers** (디바운스/전환락 검증)
- 네트워크: **MSW(Mock Service Worker)** (필요 시)
- 타입 안전성: **TypeScript** (필수)
- 브라우저 히스토리: JSDOM 환경에서 최소한으로 시뮬레이션 (history API mock)
- 접근성: **jest-axe**(선택), RTL 기본 쿼리로 핵심 포커스 전환만 검증

> 프로젝트 루트 예시
```
/src
  /app
  /stackflow
    activities/
    config/
    utils/
  /tests
    /navigation
      __helpers__/
      cases/
      specs/
```

---

## 3) 활동(Activities) & 라우트 스키마 (예시)

> 실제 프로젝트의 Activity 리스트와 Params 타입에 맞춰 조정하세요.

```ts
// src/stackflow/config/activities.ts
export type Activities =
  | { name: 'A'; params?: {} }
  | { name: 'B'; params?: { userId?: number } }
  | { name: 'C'; params?: {} }
  | { name: 'Login'; params?: {} }
  | { name: 'Home'; params?: {} }
  | { name: 'Product'; params?: { productId: string } }
  | { name: 'Order'; params?: { orderId?: string } }
  | { name: 'PaymentComplete'; params?: { receiptId: string } };

// 화면 컴포넌트 예시 스켈레톤 (테스트 식별 가능한 data-testid 포함)
import React from 'react';
// import { useActivity } from '@stackflow/react'; // 프로젝트에 맞게 조정

export const A = () => <div data-testid="screen-A">Screen A</div>;
export const B = (/* props or useActivity() */) => {
  // const { params } = useActivity<{ userId?: number }>();
  return (
    <div data-testid="screen-B">
      Screen B
      {/* <span data-testid="userId">{params.userId ?? 'default'}</span> */}
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

## 4) Stackflow 설정 (테스트용 인스턴스)

> 아래는 **테스트용 어댑터** 설계 예시입니다. 실제 `createStackflow` 구성에 맞춰 import/플러그인/옵션을 교체하세요.

```ts
// src/stackflow/config/stackflowTestApp.tsx
import React from 'react';
import { createStackflow, Stack, useFlow, Flow } from '@stackflow/react';
import { basicRendererPlugin } from '@stackflow/plugin-basic-renderer';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import {
  Activities,
  A, B, C, Login, Home, Product, Order, PaymentComplete,
} from './activities';

export type RouteName = Activities['name'];
export type PushParams = Record<string, any> | undefined;

// TestFlowController는 실제 Flow 타입의 부분 집합으로 정의하여 타입 안정성 확보
export type TestFlowController = Pick<Flow, 'push' | 'pop' | 'replace'> & {
  popTo: (name: RouteName) => void;
  getStack: () => { name: string; params: Record<string, any> }[];
};

// 실제 앱 구성과 동기화된 테스트용 인스턴스
export const createTestStackApp = () => {
  const stackflow = createStackflow<Activities>({
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
    transitionDuration: 0, // 테스트를 위해 애니메이션 비활성화
  });

  let flowInstance: Flow | null = null;

  // 래퍼 컴포넌트 (테스트에서 렌더)
  const App: React.FC = () => {
    const flow = useFlow();
    flowInstance = flow; // 컴포넌트 외부에서 접근 가능하도록 할당
    return <Stack />;
  };

  // 테스트 컨트롤러 (flowInstance를 통해 실제 flow actions 호출)
  const flowController: TestFlowController = {
    push: (name, params) => flowInstance?.push(name, params || {}),
    replace: (name, params) => flowInstance?.replace(name, params || {}),
    pop: () => flowInstance?.pop(),
    popTo: (name) => {
      if (!flowInstance) return;
      const { activities } = flowInstance.getStack();
      const targetIndex = activities.findIndex(a => a.name === name);
      if (targetIndex > -1) {
        const popCount = activities.length - 1 - targetIndex;
        if (popCount > 0) {
          flowInstance.pop({ count: popCount });
        }
      }
    },
    getStack: () => {
      if (!flowInstance) return [];
      const { activities } = flowInstance.getStack();
      return activities.map((s) => ({ name: s.name, params: s.params }));
    },
  };

  const TestApp = () => (
    <stackflow.Provider>
      <App />
    </stackflow.Provider>
  );

  return { App: TestApp, flowController };
};
```

> ✅ **의도**: 테스트에서 내비 API 호출을 간단하게 하기 위해 `flowController`를 주입/획득 가능한 형태로 만드는 것이 핵심입니다. 구현은 프로젝트의 Stackflow 구성과 동일하게 연결하세요.

---

## 5) 테스트 헬퍼

```ts
// src/tests/navigation/__helpers__/renderWithStackflow.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { createTestStackApp } from '../../../stackflow/config/stackflowTestApp';

export const renderWithStackflow = () => {
  const { App, flowController } = createTestStackApp();
  const utils = render(<App />);
  return { ...utils, flow: flowController };
};
```

```ts
// src/tests/navigation/__helpers__/user.ts
import userEvent from '@testing-library/user-event';
export const user = userEvent.setup({ delay: null });
```

```ts
// src/tests/navigation/__helpers__/timers.ts
export const useFakeTimers = () => {
  jest.useFakeTimers();
  return {
    advance: (ms: number) => jest.advanceTimersByTime(ms),
    runAll: () => jest.runAllTimers(),
    useReal: () => jest.useRealTimers(),
  };
};
```

---

### 5.1) 테스트 더블 (Mocks & Fakes)

플랫폼 제스처나 브라우저 히스토리와 같은 외부 의존성은 테스트에서 제어하기 어렵습니다. 이를 위해 테스트 더블(Mock, Stub, Fake)을 사용합니다.

#### 브라우저 히스토리 Mock

`historySyncPlugin`은 `window.history` API를 사용합니다. Jest의 `jsdom` 환경에서는 이 API가 존재하지만, 테스트 중 상태를 직접 조작하고 검증하기 위해 Mocking이 유용합니다.

```ts
// src/tests/navigation/__helpers__/history.ts
export const mockHistory = () => {
  const history = {
    back: jest.fn(),
    forward: jest.fn(),
    pushState: jest.fn(),
    replaceState: jest.fn(),
    go: jest.fn(),
    length: 0,
    state: null,
    scrollRestoration: 'auto',
    [Symbol.iterator]: jest.fn(),
  };

  // window.history를 jest.spyOn으로 감싸거나 직접 할당하여 교체
  const spy = jest.spyOn(window, 'history', 'get');
  spy.mockReturnValue(history as any);
  
  // 테스트에서 history.back() 호출 시뮬레이션
  const firePopState = () => {
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return { history, firePopState, spy };
};

// 사용 예시 (spec 파일)
// import { mockHistory } from '../__helpers__/history';
// const { history, firePopState } = mockHistory();
// firePopState(); // 브라우저 뒤로가기 버튼 클릭 시뮬레이션
```

#### 플랫폼 제스처 시뮬레이션

네이티브 제스처(스와이프 등)는 JSDOM에서 시뮬레이션할 수 없습니다. 대신, 제스처 발생 시 호출되는 `flow.pop()`과 같은 내비게이션 액션을 직접 호출하여 결과를 검증합니다. 만약 제스처를 감지하는 로직이 별도로 있다면(예: 커스텀 훅) 해당 로직을 Mocking 합니다.

```ts
// 예: useSwipeBack 훅이 있다고 가정
// jest.mock('../../../hooks/useSwipeBack');
// const mockedUseSwipeBack = useSwipeBack as jest.Mock;

// 테스트에서 제스처 시뮬레이션
// mockedUseSwipeBack.mockImplementation(({ onSwipe }) => {
//   // 스와이프 성공 시뮬레이션
//   const simulateSwipeSuccess = () => onSwipe();
//   return { simulateSwipeSuccess };
// });
```

## 6) 테스트 생성 규칙 (AI Agent용)

- **명명 규칙**
  - 파일: `ID_테스트요약.spec.tsx` (예: `01_push_pop_basic.spec.tsx`)
  - 테스트 이름: `[ID] <Category> - <Title>`
  - 테스트ID/태그: `data-testid` 기준으로 스크린 식별 (`screen-A`, `screen-B`, ...)

- **일반 패턴**
  1. `renderWithStackflow()` 로 앱 마운트
  2. `flow.push/replace/pop/popTo` 호출 (필요 시 fake timers로 전환 시간 처리)
  3. RTL 쿼리로 화면/파라미터/상태 검증
  4. 브라우저/제스처/백버튼은 mock/시뮬레이션
  5. 각 테스트는 **기대 결과**와 **체크 포인트/로그**를 반드시 검증(assert)

- **모달/오버레이**
  - 테스트 용 모달 컴포넌트 삽입 시, 모달 상태는 **스택과 독립**적으로 동작해야 함.
  - 뒤로가기 우선순위: 모달 open → back → 모달 close(1차) → pop(2차)

- **데바운스/전환락**
  - 동일 화면 연속 push는 디바운스 혹은 전환락으로 **중복 방지**
  - Jest fake timers로 시간 관련 동작을 제어

- **웹 히스토리 동기화**
  - `history.back()` / `history.forward()` 시뮬레이션 시 스택 상태 일치 검증

---

## 7) 테스트 스켈레톤 (대표 케이스)

> 아래 스켈레톤은 **대표 패턴**만 예시합니다. AI Agent는 이 패턴을 각 유스케이스(01~24)에 **확장**하여 파일 생성하세요.

### [01] 기본 — 정상 푸시/팝 A↔B

```ts
// src/tests/navigation/specs/01_push_pop_basic.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[01] 기본 - 정상 푸시/팝 A↔B', () => {
  it('A→B push 후 pop으로 A 복귀', async () => {
    const { flow } = renderWithStackflow();

    // 초기 A 진입 가정이 없다면 먼저 A로 진입
    flow.push('A');

    flow.push('B');
    // expect(await screen.findByTestId('screen-B')).toBeInTheDocument();

    flow.pop();
    // expect(await screen.findByTestId('screen-A')).toBeInTheDocument();
  });
});
```

### [02] 기본 — 파라미터 전달(필수)

```ts
// src/tests/navigation/specs/02_params_required.spec.tsx
import { screen, within } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[02] 기본 - 파라미터 전달(필수)', () => {
  it('A→B(userId=123) 전달 및 B에서 수신', async () => {
    const { flow } = renderWithStackflow();

    flow.push('A');
    flow.push('B', { userId: 123 });

    // const b = await screen.findByTestId('screen-B');
    // const userIdEl = within(b).getByTestId('userId');
    // expect(userIdEl).toHaveTextContent('123');
  });
});
```

### [04] 기본 — 스택 교체(로그인→Home)

```ts
// src/tests/navigation/specs/04_replace_login_home.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[04] 기본 - replace(Login→Home)', () => {
  it('뒤로가기 시 로그인으로 돌아가지 않는다', async () => {
    const { flow } = renderWithStackflow();

    flow.push('Login');
    flow.replace('Home');

    flow.pop();
    // 기대: 이전 없음. 통합/E2E에서 종료 동작 검증 권장
  });
});
```

### [06] 고급 — 특정 화면으로 popTo

```ts
// src/tests/navigation/specs/06_popTo_product.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[06] 고급 - popTo(Product)', () => {
  it('Product→Order→PaymentComplete 이후 Product로 복귀', async () => {
    const { flow } = renderWithStackflow();

    flow.push('Product', { productId: 'P1' });
    flow.push('Order', { orderId: 'O1' });
    flow.push('PaymentComplete', { receiptId: 'R1' });

    flow.popTo('Product');
    // expect(await screen.findByTestId('screen-Product')).toBeInTheDocument();
  });
});
```

### [08] 고급 — 모달/오버레이 영향 분리

```ts
// src/tests/navigation/specs/08_modal_overlay_independent.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[08] 고급 - 모달/오버레이 영향 분리', () => {
  it('모달 열린 상태에서 push해도 스택은 정상 동작', async () => {
    const { flow } = renderWithStackflow();

    flow.push('B');
    // openModal();
    flow.push('C');

    // expect(await screen.findByTestId('screen-C')).toBeInTheDocument();
    // closeModal();
  });
});
```

### [10] 고급(iOS) — 스와이프 백 제스처

```ts
// src/tests/navigation/specs/10_swipe_back_ios.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[10] 고급(iOS) - 스와이프 백 제스처', () => {
  it('스와이프 성공 시 pop과 동일, 취소 시 유지', async () => {
    const { flow } = renderWithStackflow();

    flow.push('A');
    flow.push('B');

    // simulateSwipeBack({ success: true });
    flow.pop();

    flow.push('B');
    // simulateSwipeBack({ success: false });
  });
});
```

### [12] 예외 — 존재하지 않는 화면 push

```ts
// src/tests/navigation/specs/12_push_invalid_screen.spec.tsx
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[12] 예외 - 존재하지 않는 화면 push', () => {
  it('크래시 없이 에러 핸들링', () => {
    const { flow } = renderWithStackflow();
    // @ts-expect-error 테스트 목적: 타입 밖 이름 전달
    expect(() => flow.push('NotExistScreen' as any)).toThrowError();
  });
});
```

### [14] 예외/중복 — 동일 화면 연속 푸시(더블탭)

```ts
// src/tests/navigation/specs/14_double_push_debounce.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';
import { useFakeTimers } from '../__helpers__/timers';

describe('[14] 예외/중복 - 동일 화면 연속 푸시(더블탭)', () => {
  it('디바운스/전환락으로 중복 방지', async () => {
    const { flow } = renderWithStackflow();
    const t = useFakeTimers();

    flow.push('A');
    flow.push('B');
    flow.push('B'); // 전환 중 중복 호출

    t.advance(350);
    // expect(await screen.findByTestId('screen-B')).toBeInTheDocument();

    t.useReal();
  });
});
```

### [18] 상태/복원 — 새로고침/재시작 복원

```ts
// src/tests/navigation/specs/18_restore_on_reload.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[18] 상태/복원 - 새로고침/재시작 복원', () => {
  it('직렬화된 스택을 재마운트 시 복구', async () => {
    // setSerializedStack(['A','B','C']);
    const { flow } = renderWithStackflow();
    // expect(flow.getStack()).toEqual(['A','B','C']);
  });
});
```

### [19] 라우팅 — 딥링크 중간 진입

```ts
// src/tests/navigation/specs/19_deeplink_entry.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[19] 라우팅 - 딥링크 중간 진입', () => {
  it('C로 직접 진입 시 상위 스택을 구성하거나 가드로 리다이렉트', async () => {
    const { flow } = renderWithStackflow();
    // expect(await screen.findByTestId('screen-C')).toBeInTheDocument();
  });
});
```

### [20] 라우팅 — 브라우저 뒤로가기 동기화

```ts
// src/tests/navigation/specs/20_browser_history_sync.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[20] 라우팅 - 브라우저 뒤로가기 동기화', () => {
  it('history.back()이 pop과 동일하게 동작', async () => {
    const { flow } = renderWithStackflow();
    flow.push('A'); flow.push('B'); flow.push('C');

    // mockHistoryBack();
    flow.pop();

    // mockHistoryBack();
    flow.pop();
  });
});
```

> 나머지 케이스(03,05,07,09,11,13,15,16,17,21,22,23,24)도 위 패턴을 참고하여 **동일한 파일 구조와 assert 포인트**로 생성합니다.

---

## 8) 커버리지 매트릭스 (ID → 파일 매핑)

- `01_push_pop_basic.spec.tsx`
- `02_params_required.spec.tsx`
- `03_params_optional_default.spec.tsx`
- `04_replace_login_home.spec.tsx`
- `05_multi_push_pop_abc.spec.tsx`
- `06_popTo_product.spec.tsx`
- `07_popTo_missing_target.spec.tsx`
- `08_modal_overlay_independent.spec.tsx`
- `09_modal_back_priority.spec.tsx`
- `10_swipe_back_ios.spec.tsx`
- `11_android_hardware_back.spec.tsx`
- `12_push_invalid_screen.spec.tsx`
- `13_params_type_guard.spec.tsx`
- `14_double_push_debounce.spec.tsx`
- `15_slow_network_duplicate_trigger.spec.tsx`
- `16_param_based_dedup.spec.tsx`
- `17_transition_lock_queue.spec.tsx`
- `18_restore_on_reload.spec.tsx`
- `19_deeplink_entry.spec.tsx`
- `20_browser_history_sync.spec.tsx`
- `21_error_boundary_navigation.spec.tsx`
- `22_accessibility_focus.spec.tsx`
- `23_perf_leak_stress.spec.tsx`
- `24_telemetry_logging.spec.tsx`

---

## 9) 수용 기준(Acceptance Criteria)

각 테스트는 다음을 **반드시** 포함한다.

1. **초기 조건**: 스택 상태/활성 화면/모달 여부/타이머 상태 설명
2. **행동**: push/pop/replace/popTo/제스처/히스토리 조작
3. **기대 결과**: 활성 화면, 스택 길이/순서, 파라미터 수신, 히스토리 동기화, 접근성 포커스
4. **로그/메트릭**: 에러/경고 없음, 필요 시 텔레메트리 mock 호출 검증
5. **클린업**: 타이머 복원, 이벤트 핸들러 해제, DOM 정리

---

## 10) 텔레메트리/로깅 (24번)

```ts
// src/tests/navigation/specs/24_telemetry_logging.spec.tsx
describe('[24] 관측 - 텔레메트리/로깅', () => {
  it('push/pop/replace 이벤트가 올바른 payload로 로깅된다', () => {
    // const log = jest.spyOn(analytics, 'track');
    // flow.push('B'); expect(log).toHaveBeenCalledWith('nav_push', { name: 'B' });
    // flow.pop();    expect(log).toHaveBeenCalledWith('nav_pop', expect.anything());
    // flow.replace('Home'); expect(log).toHaveBeenCalledWith('nav_replace', { name: 'Home' });
  });
});
```

---

## 11) 접근성 가이드 (22번)

- 화면 전환 시 **최상단 헤딩/주요 Landmark**에 포커스 이동
- 모달 오픈 시 **포커스 트랩** 유지, 닫힐 때 **트리거로 포커스 복귀**
- 스크린리더에서 화면 제목/상태 변경을 읽을 수 있게 구현 (`aria-live` 등)

```ts
// src/tests/navigation/specs/22_accessibility_focus.spec.tsx
import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[22] 접근성 - 포커스 관리', () => {
  it('A→B 전환 시 주요 요소에 포커스', async () => {
    const { flow } = renderWithStackflow();
    flow.push('A'); flow.push('B');

    // const b = await screen.findByTestId('screen-B');
    // expect(b.querySelector('h1')).toHaveFocus();
  });
});
```

---

## 12) 실행 방법

- 스크립트 예시
```jsonc
// package.json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

- Jest 설정 예시
```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
};
```

- Setup 파일 예시
```ts
// jest.setup.ts
import '@testing-library/jest-dom';
```

---

## 13) AI Agent 생성 지시문 (프롬프트 템플릿)

```
당신은 Stackflow 기반 하이브리드 앱의 내비게이션 테스트 코드를 생성하는 테스트 엔지니어입니다.
문서 "stackFlowUseCasePRD.md"의 섹션 6~9를 엄격히 준수하여, 유스케이스 ID별(Jest+RTL) 테스트 파일을 생성하세요.

규칙:
- 파일명/테스트명/주석에 ID를 유지
- import 경로는 현재 레포 구조에 맞게 상대경로로 작성
- renderWithStackflow, flowController를 사용
- 전환 시간, 디바운스 시간은 jest fake timers로 제어
- 모달/제스처/히스토리는 테스트 더블을 노출하고 주석으로 TODO를 남기지 말고 구현
- 각 테스트는 기대 결과와 체크 포인트를 명시적으로 assert

출력:
- src/tests/navigation/specs/<파일>.* 24개 테스트 파일
- 필요한 경우 __helpers__ / mocks / adapters 추가 생성
```

---

## 14) Definition of Done (완료 기준)

- [ ] 24개 케이스 모두 테스트 파일 존재 및 통과
- [ ] 주요 기능(푸시/팝/리플레이스/popTo/제스처/브라우저백/모달) 커버됨
- [ ] 타입 가드/에러 경계/중복 방지/전환 안정성 검증
- [ ] 접근성 핵심 흐름 검증
- [ ] 텔레메트리 이벤트 검증
- [ ] CI에서 `test:coverage` 80% 이상
- [ ] 문서/주석에 **프로젝트별 연결 포인트** 명시 (flow 연결, history 동기화, 모달 핸들러 등)

---

## 15) 부록 — 구현 체크리스트

- [ ] `flowController`가 실제 Stackflow actions와 연결됨
- [ ] 각 Activity에 `data-testid`가 부여됨
- [ ] 파라미터 타입(필수/옵션/기본값) 선언되어 TS 단계에서 에러 탐지
- [ ] 브라우저 히스토리 mock/플러그인 테스트 더블 준비
- [ ] 모달/오버레이는 독립 레이어로 구현되어 스택에 영향 없음
- [ ] 디바운스/전환락 전역 유틸 (또는 내비 래퍼)로 일관 적용
- [ ] 딥링크/가드/프리패치 정책 문서화 및 테스트 반영

---

### 끝.
