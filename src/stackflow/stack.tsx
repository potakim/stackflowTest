import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import * as screens from "../components/screens";

const stack = stackflow({
  transitionDuration: 350,
  activities: screens,
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      theme: "cupertino",
    }),
    historySyncPlugin({
      routes: {
        A: "/",
        B: "/b",
        C: "/c",
        D: "/d",
        Login: "/login",
        Home: "/home",
        Product: "/product/:productId",
        Order: "/order",
        PaymentComplete: "/payment-complete",
        PopToTest: "/pop-to-test",
        Modal: "/modal",
        ErrorScreen: "/error",
      },
      fallbackActivity: () => "A",
      useHash: true,
    }),
  ],
  initialActivity: () => "A",
});

export const { Stack, useFlow } = stack;
export default stack;
