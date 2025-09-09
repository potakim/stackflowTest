import React from 'react';
// import { useActivity } from '@stackflow/react'; // 프로젝트에 맞게 조정

export type Activities =
  | { name: 'A'; params?: {} }
  | { name: 'B'; params?: { userId?: number } }
  | { name: 'C'; params?: {} }
  | { name: 'Login'; params?: {} }
  | { name: 'Home'; params?: {} }
  | { name: 'Product'; params?: { productId: string } }
  | { name: 'Order'; params?: { orderId?: string } }
  | { name: 'PaymentComplete'; params?: { receiptId: string } };

// 화면 컴포넌트 예시 스켈레톤 (테스트 식별 가능한 data-testid 포함)
export const A = () => <div data-testid="screen-A">Screen A</div>;
export const B = (/* props or useActivity() */) => {
  // const { params } = useActivity<{ userId?: number }>();
  return (
    <div data-testid="screen-B">
      Screen B
      {/* <span data-testid="userId">{params.userId ?? 'default'}</span> */}
    </div>
  );
};
export const C = () => <div data-testid="screen-C">Screen C</div>;
export const Login = () => <div data-testid="screen-Login">Login</div>;
export const Home = () => <div data-testid="screen-Home">Home</div>;
export const Product = () => <div data-testid="screen-Product">Product</div>;
export const Order = () => <div data-testid="screen-Order">Order</div>;
export const PaymentComplete = () => (
  <div data-testid="screen-PaymentComplete">Payment Complete</div>
);
