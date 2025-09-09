import React from 'react';
import { render } from '@testing-library/react';
import { createTestStackApp } from '../../../stackflow/config/stackflowTestApp';

export const renderWithStackflow = () => {
  const { App, flowController } = createTestStackApp();
  const utils = render(<App />);
  return { ...utils, flow: flowController };
};
