import React, { useEffect, useState } from 'react';
import stack from '../stackflow/stack';
import { useActivity, useStack } from '@stackflow/react';
import type { Activity } from "@stackflow/core";

// B 컴포넌트 내부에서 사용되던 로컬 모달
const LocalModal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "0.5rem", color: "black" }}>
        {children}
        <button onClick={onClose} style={{ marginTop: "1rem" }}>Close</button>
      </div>
    </div>
  );
};

export const A = () => {
  return (
    <div data-testid="screen-A">
      <h2>Screen A</h2>
      <p>This is the initial screen. Please select a scenario from the left panel.</p>
    </div>
  );
};

export const B = () => {
  const { params } = useActivity();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div data-testid="screen-B">
      <h2>Screen B</h2>
      <p>User ID: {(params as any).userId ?? 'N/A'}</p>
      <button onClick={() => stack.actions.push("C", {})}>Push C</button>
      <button onClick={openModal}>Open Modal (Scenario 08)</button>
      <button onClick={() => stack.actions.pop()}>Pop</button>
      <LocalModal isOpen={isModalOpen} onClose={closeModal}>
        <div data-testid="modal-content">
          <h3>Modal on B</h3>
          <p>This modal should not block navigation.</p>
        </div>
      </LocalModal>
    </div>
  );
};

export const C = () => {
  return (
    <div data-testid="screen-C">
      <h2>Screen C</h2>
      <button onClick={() => stack.actions.push('D', {})}>Push D</button>
      <button onClick={() => stack.actions.pop()}>Pop</button>
    </div>
  );
};

export const D = () => {
  return (
    <div data-testid="screen-D">
      <h2>Screen D</h2>
      <button onClick={() => stack.actions.pop()}>Pop</button>
    </div>
  );
};

export const Login = () => (
  <div data-testid="screen-Login">
    <h2>Login Screen</h2>
    <p>1초 후 Home으로 replace 됩니다.</p>
  </div>
);

export const Home = () => (
  <div data-testid="screen-Home">
    <h2>Home Screen</h2>
  </div>
);

export const Product = () => {
  const { params } = useActivity();
  return (
    <div data-testid="screen-Product">
      <h2>Product Screen</h2>
      <p>Product ID: {(params as any).productId}</p>
      <button onClick={() => stack.actions.push('Order', { orderId: 'O1' })}>Push Order</button>
      <button onClick={() => stack.actions.push('PaymentComplete', { receiptId: 'R1' })}>Push PaymentComplete</button>
      <button onClick={() => stack.actions.pop()}>Pop</button>
    </div>
  );
};

export const Order = () => {
  const { params } = useActivity();
  return (
    <div data-testid="screen-Order">
      <h2>Order Screen</h2>
      <p>Order ID: {(params as any).orderId ?? 'N/A'}</p>
      <button onClick={() => stack.actions.push('PaymentComplete', { receiptId: 'R1' })}>Push PaymentComplete</button>
      <button onClick={() => stack.actions.pop()}>Pop</button>
    </div>
  );
};

export const PaymentComplete = () => {
  const { params } = useActivity();
  const { activities } = useStack();
  const popTo = (activityName: string) => {
    const targetActivity = [...activities].reverse().find((a: Activity) => a.name === activityName);
    if (!targetActivity) {
      console.warn(`popTo: '${activityName}' activity not found in stack.`);
      return;
    }
    const targetIndex = activities.findIndex((a: Activity) => a.id === targetActivity.id);
    const currentIndex = activities.length - 1;
    const popCount = currentIndex - targetIndex;
    if (popCount > 0) {
      for (let i = 0; i < popCount; i++) {
        stack.actions.pop();
      }
    }
  };
  return (
    <div data-testid="screen-PaymentComplete">
      <h2>Payment Complete</h2>
      <p>Receipt ID: {(params as any).receiptId}</p>
      <button onClick={() => popTo('Product')}>Pop to Product (Scenario 06)</button>
      <button onClick={() => stack.actions.pop()}>Pop</button>
    </div>
  );
};

export const PopToTest = () => {
  const { activities } = useStack();
  const popTo = (activityName: string) => {
    const targetActivity = [...activities].reverse().find((a: Activity) => a.name === activityName);
    if (!targetActivity) {
      console.warn(`popTo: '${activityName}' activity not found in stack.`);
      alert(`'${activityName}' activity not found in stack.`);
      return;
    }
    const targetIndex = activities.findIndex((a: Activity) => a.id === targetActivity.id);
    const currentIndex = activities.length - 1;
    const popCount = currentIndex - targetIndex;
    if (popCount > 0) {
      for (let i = 0; i < popCount; i++) {
        stack.actions.pop();
      }
    }
  };
  return (
    <div data-testid="screen-PopToTest">
      <h2>PopTo Test Screen</h2>
      <button onClick={() => popTo('NonExistent' as any)}>Pop to NonExistent (Scenario 07)</button>
      <button onClick={() => stack.actions.pop()}>Pop</button>
    </div>
  );
};

// Scenario 09
export const Modal = () => {
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '2rem', border: '1px solid black', zIndex: 100 }}>
      <h2>Modal Activity</h2>
      <p>뒤로가기 시 이 모달이 먼저 닫혀야 합니다.</p>
      <button onClick={() => stack.actions.pop()}>Close Modal</button>
    </div>
  );
};

// Scenario 21
export const ErrorScreen = () => {
  useEffect(() => {
    throw new Error("This is a test error for ErrorBoundary.");
  }, []);
  return <div>...</div>;
};
