import React from 'react';
import { useFlow } from '../stackflow/stack';
import { useActivity, useStack } from '@stackflow/react';
import type { Activity } from "@stackflow/core";
import type { Activities, ActivityName } from '../stackflow/activities';

export const A = () => {
  const flow = useFlow();
  return (
    <div data-testid="screen-A">
      <h1>Screen A</h1>
      <button onClick={() => flow.push('B', {})}>Push B</button>
    </div>
  );
};

export const B = () => {
  const flow = useFlow();
  return (
    <div data-testid="screen-B">
      <h2>Screen B</h2>
      <button onClick={() => flow.push('C', {})}>Push C</button>
      <button onClick={() => flow.pop()}>Pop</button>
    </div>
  );
};

export const C = () => {
  const flow = useFlow();
  return (
    <div data-testid="screen-C">
      <h2>Screen C</h2>
      <button onClick={() => flow.push('D', {})}>Push D</button>
      <button onClick={() => flow.pop()}>Pop</button>
    </div>
  );
};

export const D = () => {
  const flow = useFlow();
  const { activities } = useStack();

  const popToB = () => {
    const bActivity = [...activities].reverse().find((activity: Activity) => activity.name === 'B');
    if (bActivity) {
      const bIndex = activities.findIndex((activity: Activity) => activity.id === bActivity.id);
      const currentIndex = activities.length - 1;
      const popCount = currentIndex - bIndex;
      if (popCount > 0) {
        for (let i = 0; i < popCount; i++) {
          flow.pop();
        }
      }
    } else {
      console.warn("popTo: 'B' activity not found in stack.");
    }
  };

  return (
    <div data-testid="screen-D">
      <h2>Screen D</h2>
      <button onClick={popToB}>Pop to B</button>
      <button onClick={() => flow.pop()}>Pop</button>
    </div>
  );
};


export const Login = () => (
  <div data-testid="screen-Login">
    <h2>Login Screen</h2>
  </div>
);

export const Home = () => (
  <div data-testid="screen-Home">
    <h2>Home Screen</h2>
  </div>
);

export const Product = () => {
  const flow = useFlow();
  const { params } = useActivity();
  return (
    <div data-testid="screen-Product">
      <h2>Product Screen</h2>
      <p>Product ID: {(params as any).productId}</p>
      <button onClick={() => flow.push('Order', { orderId: 'O1' })}>Push Order</button>
      <button onClick={() => flow.pop()}>Pop</button>
    </div>
  );
};

export const Order = () => {
  const flow = useFlow();
  const { params } = useActivity();
  return (
    <div data-testid="screen-Order">
      <h2>Order Screen</h2>
      <p>Order ID: {(params as any).orderId ?? 'N/A'}</p>
      <button onClick={() => flow.push('PaymentComplete', { receiptId: 'R1' })}>Push PaymentComplete</button>
      <button onClick={() => flow.pop()}>Pop</button>
    </div>
  );
};

export const PaymentComplete = () => {
  const flow = useFlow();
  const { params } = useActivity();
  const { activities } = useStack();

  const handlePopToProduct = () => {
    const productActivity = activities.find((activity: Activity) => activity.name === 'Product');
    if (productActivity) {
      const productIndex = activities.findIndex((activity: Activity) => activity.id === productActivity.id);
      const currentIndex = activities.length - 1;
      const popCount = currentIndex - productIndex;
      if (popCount > 0) {
        for (let i = 0; i < popCount; i++) {
          flow.pop();
        }
      }
    } else {
      console.warn("popTo: 'Product' activity not found in stack.");
    }
  };

  return (
    <div data-testid="screen-PaymentComplete">
      <h2>Payment Complete</h2>
      <p>Receipt ID: {(params as any).receiptId}</p>
      <button onClick={handlePopToProduct}>Pop to Product</button>
      <button onClick={() => flow.pop()}>Pop</button>
    </div>
  );
};

export const PopToTest = () => {
  const flow = useFlow();
  const { activities } = useStack();
  const activity = useActivity();

  const popTo = (activityName: ActivityName) => {
    const targetActivity = [...activities].reverse().find((a: Activity) => a.name === activityName);

    if (!targetActivity) {
      console.warn(`popTo: '${activityName}' activity not found in stack.`);
      // You could also show a toast message to the user here.
      return;
    }

    const targetIndex = activities.findIndex((a: Activity) => a.id === targetActivity.id);
    const currentIndex = activities.length - 1;
    const popCount = currentIndex - targetIndex;

    if (popCount > 0) {
      for (let i = 0; i < popCount; i++) {
        flow.pop();
      }
    }
  };

  return (
    <div data-testid="screen-PopToTest">
      <h2>PopTo Test Screen</h2>
      <p>Current Activity: {activity.name}</p>
      <button onClick={() => flow.push('B', {})}>Push B</button>
      <button onClick={() => popTo('A')}>Pop to A</button>
      <button onClick={() => popTo('PopToTest')}>Pop to PopToTest</button>
      <button onClick={() => popTo('NonExistent' as any)}>Pop to NonExistent</button>
    </div>
  );
};
