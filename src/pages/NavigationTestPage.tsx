import React from 'react';
import stack, { Stack } from '../stackflow/stack';
import ErrorBoundary from '../components/ErrorBoundary';

interface Scenario {
  id: string;
  title: string;
  action: () => void;
}

const NavigationTestPage: React.FC = () => {
  const scenarios: Scenario[] = [
    { 
      id: 'TC01', 
      title: '홈 화면으로 이동 시 스택 초기화', 
      action: () => {
        stack.actions.push('TC1_HomeScreen', {});
      } 
    },
    { 
      id: 'TC02', 
      title: '리스트 > 상세 > ... > 리스트', 
      action: () => {
        stack.actions.push('TC2_ListScreen', {});
      } 
    },
    {
      id: 'TC03',
      title: '스택 내 단계별 Step 관리',
      action: () => {
        stack.actions.push('TC3_Step1Screen', {});
      }
    },
    // More scenarios will be added here
  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '350px', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Advanced Navigation Scenarios</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {scenarios.map(s => (
            <li key={s.id} style={{ margin: '0.5rem 0' }}>
              <button onClick={s.action} style={{ width: '100%', padding: '0.75rem', textAlign: 'left', border: '1px solid #ccc', borderRadius: '4px', background: '#f0f0f0', cursor: 'pointer' }}>
                [{s.id}] {s.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <ErrorBoundary>
          <Stack />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default NavigationTestPage;
