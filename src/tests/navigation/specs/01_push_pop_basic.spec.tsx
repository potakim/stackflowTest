import { screen } from '@testing-library/react';
import { renderWithStackflow } from '../__helpers__/renderWithStackflow';

describe('[01] 기본 - 정상 푸시/팝 A↔B', () => {
  it('A→B push 후 pop으로 A 복귀', async () => {
    const { flow } = renderWithStackflow();

    // 초기 A 진입 가정이 없다면 먼저 A로 진입
    flow.push('A');

    flow.push('B');
    expect(await screen.findByTestId('screen-B')).toBeInTheDocument();

    flow.pop();
    expect(await screen.findByTestId('screen-A')).toBeInTheDocument();
  });
});
