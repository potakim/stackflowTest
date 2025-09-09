export type ActivityName = 'A' | 'B' | 'C' | 'D' | 'Login' | 'Home' | 'Product' | 'Order' | 'PaymentComplete' | 'PopToTest';

export type Activities =
  | { name: 'A'; params: {} }
  | { name: 'B'; params: { userId?: number } }
  | { name: 'C'; params: {} }
  | { name: 'D'; params: {} }
  | { name: 'Login'; params: {} }
  | { name: 'Home'; params: {} }
  | { name: 'Product'; params: { productId: string } }
  | { name: 'Order'; params: { orderId?: string } }
  | { name: 'PaymentComplete'; params: { receiptId: string } }
  | { name: 'PopToTest'; params: {} };
