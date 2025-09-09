import { stackflow } from '@stackflow/react';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import type { Activities } from './activities';
import { A, B, C, Home, Login, Order, PaymentComplete, Product } from '../components/screens';

const routes = {
  A: '/',
  B: '/b',
  C: '/c',
  Login: '/login',
  Home: '/home',
  Product: '/product/:productId',
  Order: '/order',
  PaymentComplete: '/payment-complete',
};

export const { Stack, useFlow } = stackflow<Activities>({
  activities: {
    A, B, C, Login, Home, Product, Order, PaymentComplete
  },
  plugins: [
    basicRendererPlugin(),
    historySyncPlugin({
      routes,
      fallbackActivity: () => 'A',
    }),
  ],
  initialActivity: () => 'A',
});
