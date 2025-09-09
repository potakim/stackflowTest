import React from 'react';
import { createStackflow, Stack, useFlow } from '@stackflow/react';
import type { Flow } from '@stackflow/react';
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
    push: (name, params) => flowInstance?.push(name as any, params || {}),
    replace: (name, params) => flowInstance?.replace(name as any, params || {}),
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
