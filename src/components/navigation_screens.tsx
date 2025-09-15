import React from 'react';
import { useActivity } from '@stackflow/react';
import stack, { useFlow } from '../stackflow/stack';

export const NavHomeScreen = () => (
  <div data-testid="nav-home-screen">
    <h2>Nav Home Screen</h2>
    <p>Select a test case from the left panel.</p>
  </div>
);

export const ListScreen = () => {
  const flow = useFlow();
  return (
    <div data-testid="list-screen">
      <h2>List Screen</h2>
      <button onClick={() => flow.push('DetailScreen', { id: '1' })}>Go to Detail 1</button>
    </div>
  );
};

export const DetailScreen = () => {
  const flow = useFlow();
  const { params } = useActivity();
  const id = (params as { id: string }).id;
  const nextId = parseInt(id, 10) + 1;

  return (
    <div data-testid={`detail-screen-${id}`}>
      <h2>Detail Screen {id}</h2>
      <p>Content for item {id}.</p>
      <button onClick={() => flow.push('DetailScreen', { id: nextId.toString() })}>Go to Detail {nextId}</button>
      <button onClick={() => flow.pop()}>Go Back</button>
    </div>
  );
};

export const Step1Screen = () => {
    const flow = useFlow();
    return (
        <div data-testid="step1-screen">
            <h2>Step 1</h2>
            <button onClick={() => flow.push('Step2Screen', {})}>Next Step</button>
        </div>
    );
};

export const Step2Screen = () => {
    const flow = useFlow();
    return (
        <div data-testid="step2-screen">
            <h2>Step 2</h2>
            <button onClick={() => flow.push('Step3Screen', {})}>Next Step</button>
            <button onClick={() => flow.pop()}>Prev Step</button>
        </div>
    );
};

export const Step3Screen = () => {
    const flow = useFlow();
    return (
        <div data-testid="step3-screen">
            <h2>Step 3</h2>
            <button onClick={() => flow.replace('SuccessScreen', {})}>Finish</button>
            <button onClick={() => flow.pop()}>Prev Step</button>
        </div>
    );
};

export const SuccessScreen = () => (
    <div data-testid="success-screen">
        <h2>Success!</h2>
        <p>You have completed the steps.</p>
    </div>
);

export const TC1_HomeScreen = () => {
    const flow = useFlow();
    return (
        <div data-testid="tc1-home-screen">
            <h2>TC1: Reset to Home</h2>
            <button onClick={() => flow.push('TC1_Screen1', {})}>Go to Screen 1</button>
        </div>
    );
};

export const TC1_Screen1 = () => {
    const flow = useFlow();
    return (
        <div data-testid="tc1-screen1">
            <h2>TC1: Screen 1</h2>
            <button onClick={() => flow.push('TC1_Screen2', {})}>Go to Screen 2</button>
            <button onClick={() => flow.pop()}>Back</button>
        </div>
    );
};

export const TC1_Screen2 = () => {
    const flow = useFlow();
    return (
        <div data-testid="tc1-screen2">
            <h2>TC1: Screen 2</h2>
            <button onClick={() => {
                const stackSize = stack.actions.getStack().activities.length;
                for (let i = 0; i < stackSize - 1; i++) {
                    flow.pop();
                }
            }}>Reset to Home</button>
            <button onClick={() => flow.pop()}>Back</button>
        </div>
    );
};
