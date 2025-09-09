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
