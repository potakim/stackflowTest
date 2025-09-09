import React from 'react';
import ReactDOM from 'react-dom/client';
import stack, { Stack } from './stackflow/stack';
import './index.css';

const scenarios = [
  { id: 1, title: '기본 푸시/팝', action: () => stack.actions.push('B', {}) },
  { id: 2, title: '파라미터 전달(필수)', action: () => stack.actions.push('B', { userId: 123 }) },
  { id: 3, title: '파라미터 전달(옵션)', action: () => stack.actions.push('B', {}) },
  { id: 4, title: '스택 교체(replace)', action: () => { stack.actions.push('Login', {}); setTimeout(() => stack.actions.replace('Home', {}), 3000); } },
  { id: 5, title: '다중 푸시/팝', action: () => { stack.actions.push('B', {}); setTimeout(() => stack.actions.push('C', {}), 500); } },
  { id: 6, title: '특정 화면으로 popTo', action: () => alert('popTo는 커스텀 구현이 필요합니다.') },
  { id: 7, title: 'popTo 대상 없음', action: () => alert('popTo는 커스텀 구현이 필요합니다.') },
  { id: 8, title: '모달/오버레이 영향 분리', action: () => alert('구현 필요: 모달 열고 C push') },
  { id: 9, title: '모달 뒤로가기 우선순위', action: () => alert('구현 필요: 모달 열고 뒤로가기') },
  { id: 10, title: 'iOS 스와이프 백', action: () => alert('iOS 기기에서 B로 이동 후 테스트') },
  { id: 11, title: 'Android 하드웨어 백', action: () => alert('Android 기기에서 B로 이동 후 테스트') },
  { id: 12, title: '존재하지 않는 화면 push', action: () => { try { stack.actions.push('NotExist' as any, {}); } catch (e) { console.error(e); } } },
  { id: 13, title: '파라미터 타입 가드', action: () => alert('TypeScript 컴파일 타임에 확인') },
  { id: 14, title: '동일 화면 연속 푸시(더블탭)', action: () => { stack.actions.push('B', {}); stack.actions.push('B', {}); } },
  { id: 15, title: '느린 네트워크 중복 트리거', action: () => alert('구현 필요: API 호출 시뮬레이션') },
  { id: 16, title: '파라미터 기반 중복 방지', action: () => { stack.actions.push('Product', { productId: 'P1' }); stack.actions.push('Product', { productId: 'P1' }); } },
  { id: 17, title: '전환 애니메이션 중 인터랙션', action: () => alert('애니메이션 활성화 후 테스트 필요') },
  { id: 18, title: '새로고침 시 상태 복원', action: () => { stack.actions.push('C', {}); alert('C 화면에서 새로고침하여 확인'); } },
  { id: 19, title: '딥링크 진입', action: () => alert('브라우저 주소창에 /Product?productId=P1 입력') },
  { id: 20, title: '브라우저 뒤로가기 동기화', action: () => { stack.actions.push('B', {}); setTimeout(() => stack.actions.push('C', {}), 500); alert('브라우저 뒤로가기 버튼으로 테스트'); } },
  { id: 21, title: '에러 바운더리', action: () => alert('구현 필요: 에러 발생하는 컴포넌트 push') },
  { id: 22, title: '접근성 포커스', action: () => alert('화면 전환 후 포커스 이동 확인') },
  { id: 23, title: '성능/메모리 누수', action: () => alert('개발자 도구로 메모리 변화 확인') },
  { id: 24, title: '텔레메트리/로깅', action: () => { console.log('Action Triggered!'); stack.actions.push('B', {}); } },
];

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
        <h2>Test Scenarios</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {scenarios.map(s => (
            <li key={s.id} style={{ margin: '10px 0' }}>
              <button onClick={s.action} style={{ width: '100%', padding: '10px', textAlign: 'left' }}>
                [{s.id.toString().padStart(2, '0')}] {s.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        <Stack />
      </div>
    </div>
  </React.StrictMode>,
);
