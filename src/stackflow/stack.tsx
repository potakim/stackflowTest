import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { activities } from "./activities";

const stack = stackflow({
  transitionDuration: 350,
  activities,
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

        // Routes for new navigation test cases
        NavHomeScreen: "/nav-home",
        ListScreen: "/nav-list",
        DetailScreen: "/nav-detail/:id",
        Step1Screen: "/nav-step1",
        Step2Screen: "/nav-step2",
        Step3Screen: "/nav-step3",
        SuccessScreen: "/nav-success",

        // Routes for TC1
        TC1_HomeScreen: "/nav-tc1-home",
        TC1_Screen1: "/nav-tc1-screen1",
        TC1_Screen2: "/nav-tc1-screen2",

        // Routes for TC2
        TC2_ListScreen: "/nav-tc2-list",
        TC2_DetailScreen: "/nav-tc2-detail/:id",

        // Routes for TC3
        TC3_Step1Screen: "/nav-tc3-step1",
        TC3_Step2Screen: "/nav-tc3-step2",
        TC3_Step3Screen: "/nav-tc3-step3",

        // Routes for TC4
        MainTabs: "/nav-tc4-tabs",

        // Routes for TC5
        ArticleScreen: "/nav-tc5-article/:id",

        // Routes for TC6
        TC06_HomeScreen: "/nav-tc6-home",
        TC06_ModalScreen: "/nav-tc6-modal",
      },
      fallbackActivity: () => "NavHomeScreen",
      useHash: true,
    }),
  ],
  initialActivity: () => "NavHomeScreen",
});

export const { Stack, useFlow } = stack;
export default stack;
