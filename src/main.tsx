import React from 'react';
import ReactDOM from 'react-dom/client';
import stack, { Stack } from './stackflow/stack';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const scenarios = [
  { id: 1, title: '기본 푸시/팝', action: () => stack.actions.push('B', {}) },
  { id: 2, title: '파라미터 전달(필수)', action: () => stack.actions.push('B', { userId: 123 }) },
  { id: 3, title: '파라미터 전달(옵션)', action: () => stack.actions.push('B', {}) },
  { id: 4, title: '스택 교체(replace)', action: () => { stack.actions.push('Login', {}); setTimeout(() => stack.actions.replace('Home', {}), 1000); } },
  { id: 5, title: '다중 푸시/팝', action: () => { stack.actions.push('B', {}); setTimeout(() => stack.actions.push('C', {}), 500); } },
  { id: 6, title: '특정 화면으로 popTo', action: () => stack.actions.push('Product', { productId: 'P1' }) },
  { id: 7, title: 'popTo 대상 없음', action: () => stack.actions.push('PopToTest', {}) },
  { id: 8, title: '모달/오버레이 영향 분리', description: 'B 화면의 "Open Modal" 버튼으로 테스트' },
  { id: 9, title: '모달 뒤로가기 우선순위', action: () => stack.actions.push('Modal', {}) },
  { id: 10, title: 'iOS 스와이프 백', description: 'B로 이동 후 iOS 기기에서 스와이프하여 테스트' },
  { id: 11, title: 'Android 하드웨어 백', description: 'B로 이동 후 Android 기기에서 하드웨어 백 버튼으로 테스트' },
  { id: 12, title: '존재하지 않는 화면 push', action: () => { try { stack.actions.push('NotExist' as any, {}); } catch (e) { console.error(e); alert('존재하지 않는 화면으로 push 시도. 콘솔 에러 확인'); } } },
  { id: 13, title: '파라미터 타입 가드', description: '코드를 잘못된 파라미터로 수정 시 TypeScript 컴파일 에러 확인' },
  { id: 14, title: '동일 화면 연속 푸시(더블탭)', action: () => { stack.actions.push('B', {}); stack.actions.push('B', {}); } },
  { id: 15, title: '느린 네트워크 중복 트리거', description: '개발자 도구 네트워크 조절 후 테스트 필요' },
  { id: 16, title: '파라미터 기반 중복 방지', action: () => { stack.actions.push('Product', { productId: 'P1' }); setTimeout(() => stack.actions.push('Product', { productId: 'P1' }), 100); } },
  { id: 17, title: '전환 애니메이션 중 인터랙션', description: '애니메이션 활성화 후 빠른 연타로 테스트 필요' },
  { id: 18, title: '새로고침 시 상태 복원', action: () => { stack.actions.push('C', {}); alert('C 화면으로 이동 후 브라우저를 새로고침하세요.'); } },
  { id: 19, title: '딥링크 진입', description: '브라우저 주소창에 /#/Product?productId=P123 입력하여 테스트' },
  { id: 20, title: '브라우저 뒤로가기 동기화', action: () => { stack.actions.push('B', {}); setTimeout(() => stack.actions.push('C', {}), 500); alert('C 화면으로 이동 후 브라우저 뒤로가기 버튼 클릭'); } },
  { id: 21, title: '에러 바운더리', action: () => stack.actions.push('ErrorScreen', {}) },
  { id: 22, title: '접근성 포커스', description: '화면 전환 후 페이지 제목(h2)에 포커스되는지 확인' },
  { id: 23, title: '성능/메모리 누수', description: 'B와 C를 반복적으로 push/pop 후 개발자 도구 메모리 탭 확인' },
  { id: 24, title: '텔레메트리/로깅', action: () => { console.log("Triggering navigation for logging test"); stack.actions.push('B', {}); }, description: '버튼 클릭 시 개발자 도구 콘솔에 로그가 출력되는지 확인' },
];

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '350px', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Stackflow Test Scenarios</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {scenarios.map(s => (
            <li key={s.id} style={{ margin: '0.5rem 0' }}>
              {s.action ? (
                <button onClick={s.action} style={{ width: '100%', padding: '0.75rem', textAlign: 'left', border: '1px solid #ccc', borderRadius: '4px', background: '#f0f0f0', cursor: 'pointer', color:'black' }}>
                  [{s.id.toString().padStart(2, '0')}] {s.title}
                </button>
              ) : (
                <div style={{ width: '100%', padding: '0.75rem', textAlign: 'left', border: '1px solid #eee', borderRadius: '4px', background: '#fafafa', color: '#555' }}>
                  <span style={{ fontWeight: 'bold' }}>[{s.id.toString().padStart(2, '0')}] {s.title}:</span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.9em' }}>{s.description}</span>
                </div>
              )}
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
  </React.StrictMode>,
);
