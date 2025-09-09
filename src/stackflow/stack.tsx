import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import * as screens from "../components/screens";
const routes = {
  A: '/',
  B: '/b',
  C: '/c',
  D: '/d',
  Login: '/login',
  Home: '/home',
  Product: '/product/:productId',
  Order: '/order',
  PaymentComplete: '/payment-complete',
  PopToTest: '/pop-to-test',
};

const stack = stackflow({
  transitionDuration: 350,
  activities: screens,
  plugins: [
    basicRendererPlugin(),
    historySyncPlugin({
      routes,
      fallbackActivity: () => "A",
    }),
  ],
  initialActivity: () => "A",
});

export const { Stack, useFlow } = stack;
export default stack;
