export type ActivityName = 'A' | 'B' | 'C' | 'Login' | 'Home' | 'Product' | 'Order' | 'PaymentComplete';

export type Activities =
  | { name: 'A'; params: {} }
  | { name: 'B'; params: { userId?: number } }
  | { name: 'C'; params?: {} }
  | { name: 'Login'; params?: {} }
  | { name: 'Home'; params?: {} }
  | { name: 'Product'; params: { productId: string } }
  | { name: 'Order'; params: { orderId?: string } }
  | { name: 'PaymentComplete'; params: { receiptId: string } };
