import React from 'react';
import { useFlow } from '../stackflow/stack';
import { useActivity } from '@stackflow/react';
import type { Activities } from '../stackflow/activities';

export const A = () => {
  return (
    <div data-testid="screen-A">
      <h1>Screen A</h1>
      <p>Select a scenario from the left panel.</p>
    </div>
  );
};

export const B = () => {
  const flow = useFlow();
  const { params } = useActivity();
  return (
    <div data-testid="screen-B">
      <h2>Screen B</h2>
      <p>User ID: <span data-testid="userId">{(params as any).userId ?? 'default'}</span></p>
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
      <button onClick={() => flow.push('Product', { productId: 'P1' })}>Push Product</button>
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
  return (
    <div data-testid="screen-PaymentComplete">
      <h2>Payment Complete</h2>
      <p>Receipt ID: {(params as any).receiptId}</p>
      <button onClick={() => {
        // popTo is not a standard action, using multiple pops for now
        flow.pop();
        setTimeout(() => flow.pop(), 500);
        setTimeout(() => flow.pop(), 1000);
      }}>Pop to Product (Simulated)</button>
      <button onClick={() => flow.pop()}>Pop</button>
    </div>
  );
};
